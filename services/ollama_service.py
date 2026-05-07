"""
HaloSitek AI Microservice - Ollama Service
============================================
Modul untuk berkomunikasi dengan Ollama API lokal.
Bertanggung jawab atas:
  1. Menghasilkan jawaban teks arsitektural (chat completion).
  2. Memperbaiki prompt pengguna menjadi prompt teknis bahasa Inggris
     untuk pipeline Stable Diffusion.
"""

import logging

import httpx

from config import settings

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────
#  System Prompt
# ─────────────────────────────────────────────

SYSTEM_PROMPT_ARCHITECT = """Kamu adalah HaloSitek AI, asisten ahli di bidang arsitektur dan desain bangunan.
Tugasmu adalah menjawab pertanyaan seputar arsitektur, konstruksi, desain interior/eksterior,
tata ruang, material bangunan, peraturan bangunan di Indonesia (IMB/PBG), dan topik terkait lainnya.

Aturan:
- Jawab dalam Bahasa Indonesia yang sopan dan profesional.
- Berikan penjelasan yang jelas, ringkas, dan bermanfaat.
- Jika pertanyaan di luar bidang arsitektur, tolak dengan sopan dan arahkan kembali ke topik arsitektur.
- Gunakan poin-poin atau daftar bernomor jika membantu kejelasan jawaban.
"""

SYSTEM_PROMPT_IMAGE_REFINER = """You are an expert architectural prompt engineer.
Your ONLY job is to convert the user's description (which may be in Bahasa Indonesia)
into a concise, high-quality English prompt for an image generation AI (Stable Diffusion).

Rules:
- Output ONLY the refined English prompt, nothing else.
- Focus on architectural and spatial details: style, materials, lighting, perspective.
- Add helpful visual descriptors: "photorealistic", "architectural rendering", "4K", etc.
- Keep it under 77 tokens (SDXL limit).
- Do NOT add explanations or commentary.
"""


# ─────────────────────────────────────────────
#  Fungsi Utama
# ─────────────────────────────────────────────

async def generate_text_response(
    message: str,
    history: list[dict],
) -> str:
    """
    Kirim pesan ke Ollama dan dapatkan jawaban teks arsitektural.

    Args:
        message:  Pesan terbaru dari pengguna.
        history:  Daftar pesan sebelumnya [{role, content}, ...].

    Returns:
        Teks jawaban dari LLM.
    """
    messages = [{"role": "system", "content": SYSTEM_PROMPT_ARCHITECT}]

    # Tambahkan riwayat percakapan
    for msg in history:
        messages.append({"role": msg["role"], "content": msg["content"]})

    # Tambahkan pesan terbaru
    messages.append({"role": "user", "content": message})

    return await _call_ollama_chat(messages)


async def refine_prompt_for_image(user_message: str) -> str:
    """
    Minta Ollama menerjemahkan/memperbaiki deskripsi pengguna
    menjadi prompt teknis bahasa Inggris untuk Stable Diffusion.

    Args:
        user_message: Deskripsi gambar dari pengguna (bisa dalam Bahasa Indonesia).

    Returns:
        Prompt teknis dalam bahasa Inggris.
    """
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT_IMAGE_REFINER},
        {"role": "user", "content": user_message},
    ]

    refined = await _call_ollama_chat(messages)
    logger.info("Refined image prompt: %s", refined)
    return refined


# ─────────────────────────────────────────────
#  Helper Internal
# ─────────────────────────────────────────────

async def _call_ollama_chat(messages: list[dict]) -> str:
    """
    Panggil endpoint /api/chat pada Ollama.

    Ollama API Docs: https://github.com/ollama/ollama/blob/main/docs/api.md

    Args:
        messages: Daftar pesan dalam format [{role, content}, ...].

    Returns:
        Teks jawaban dari model.

    Raises:
        httpx.HTTPStatusError: Jika Ollama mengembalikan error HTTP.
        httpx.ConnectError:    Jika Ollama tidak bisa dijangkau.
    """
    url = f"{settings.OLLAMA_BASE_URL}/api/chat"
    payload = {
        "model": settings.OLLAMA_MODEL,
        "messages": messages,
        "stream": False,       # Non-streaming agar langsung dapat full response
        "options": {
            "temperature": 0.7,
            "num_predict": 1024,
        },
    }

    async with httpx.AsyncClient(timeout=120.0) as client:
        try:
            response = await client.post(url, json=payload)
            response.raise_for_status()
            data = response.json()
            return data["message"]["content"]
        except httpx.ConnectError:
            logger.error("Tidak bisa terhubung ke Ollama di %s", settings.OLLAMA_BASE_URL)
            raise
        except httpx.HTTPStatusError as e:
            logger.error("Ollama mengembalikan error: %s", e.response.text)
            raise
