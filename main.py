"""
HaloSitek AI Microservice
===========================
Entry point utama untuk AI Microservice HaloSitek.

Arsitektur:
    Laravel (client)  ──HTTP POST──►  FastAPI ──┬──► Ollama (LLM teks)
                                                └──► Stable Diffusion (gambar)

Jalankan dengan:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""

import logging
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, HTTPException, status

from config import settings
from schemas import GenerateRequest, GenerateResponse
from services.intent_classifier import classify_intent
from services.ollama_service import generate_text_response, refine_prompt_for_image
from services.image_generator import generate_image

# ─────────────────────────────────────────────
#  Logging
# ─────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s │ %(levelname)-8s │ %(name)s │ %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
logger = logging.getLogger("halositek")


# ─────────────────────────────────────────────
#  Lifespan (startup & shutdown hooks)
# ─────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Hook saat aplikasi mulai dan berhenti."""
    logger.info("🚀  %s v%s starting up...", settings.APP_NAME, settings.APP_VERSION)
    logger.info("    Ollama  : %s (model: %s)", settings.OLLAMA_BASE_URL, settings.OLLAMA_MODEL)
    logger.info("    SD Model: %s (device: %s)", settings.SD_MODEL_ID, settings.SD_DEVICE)
    yield
    logger.info("🛑  %s shutting down...", settings.APP_NAME)


# ─────────────────────────────────────────────
#  Inisialisasi FastAPI
# ─────────────────────────────────────────────
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description=(
        "AI Microservice untuk platform konsultasi arsitektur HaloSitek. "
        "Menyediakan generasi teks (via Ollama) dan gambar (via Stable Diffusion)."
    ),
    lifespan=lifespan,
)


# ─────────────────────────────────────────────
#  Health Check
# ─────────────────────────────────────────────
@app.get(
    "/health",
    tags=["System"],
    summary="Health check endpoint",
)
async def health_check():
    """Cek apakah service hidup dan Ollama bisa dijangkau."""
    ollama_ok = False
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.get(f"{settings.OLLAMA_BASE_URL}/api/tags")
            ollama_ok = resp.status_code == 200
    except Exception:
        pass

    return {
        "status": "healthy",
        "ollama_connected": ollama_ok,
        "model": settings.OLLAMA_MODEL,
        "sd_model": settings.SD_MODEL_ID,
    }


# ─────────────────────────────────────────────
#  Endpoint Utama: /api/v1/generate
# ─────────────────────────────────────────────
@app.post(
    "/api/v1/generate",
    response_model=GenerateResponse,
    tags=["AI Generation"],
    summary="Generate respons teks atau gambar berdasarkan pesan pengguna",
)
async def generate(request: GenerateRequest):
    """
    Endpoint utama yang menerima request dari back-end Laravel.

    **Alur:**
    1. Klasifikasi intent pesan pengguna (teks / gambar).
    2. Jika **teks**: kirim ke Ollama untuk jawaban arsitektural.
    3. Jika **gambar**: minta Ollama memperbaiki prompt → generate via Stable Diffusion.
    4. Kembalikan response JSON ke Laravel.
    """
    logger.info(
        "Request dari user_id=%s | intent detection untuk: '%s'",
        request.user_id,
        request.message[:60],
    )

    # ── 1. Klasifikasi intent ──
    intent = classify_intent(request.message)
    logger.info("Intent terdeteksi: %s", intent)

    try:
        if intent == "text":
            # ── 2a. Jalur TEKS ──
            history_dicts = [msg.model_dump() for msg in request.history]
            answer = await generate_text_response(request.message, history_dicts)

            return GenerateResponse(
                type="text",
                content=answer,
            )

        else:
            # ── 2b. Jalur GAMBAR ──
            # Langkah 1: Perbaiki prompt via Ollama
            refined_prompt = await refine_prompt_for_image(request.message)

            # Langkah 2: Generate gambar via Stable Diffusion
            base64_image = generate_image(refined_prompt)

            return GenerateResponse(
                type="image",
                content=base64_image,
                prompt_used=refined_prompt,
            )

    except httpx.ConnectError:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=(
                f"Tidak dapat terhubung ke Ollama di {settings.OLLAMA_BASE_URL}. "
                "Pastikan Ollama sudah berjalan (`ollama serve`)."
            ),
        )
    except Exception as e:
        logger.exception("Error saat memproses request: %s", str(e))
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Terjadi kesalahan internal: {str(e)}",
        )


# ─────────────────────────────────────────────
#  Run langsung (opsional, untuk development)
# ─────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )
