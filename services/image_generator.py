"""
HaloSitek AI Microservice - Image Generator (Stable Diffusion)
================================================================
Modul untuk menghasilkan gambar arsitektural menggunakan
Stable Diffusion XL Turbo via library diffusers (Hugging Face).

Pipeline dimuat secara lazy saat pertama kali dibutuhkan
agar startup server tetap cepat.
"""

import base64
import logging
from io import BytesIO

import torch

from config import settings

logger = logging.getLogger(__name__)

# ─────────────────────────────────────────────
#  Singleton Pipeline (Lazy Loading)
# ─────────────────────────────────────────────
_pipeline = None


def _get_pipeline():
    """
    Muat pipeline Stable Diffusion XL Turbo secara lazy.
    Pipeline hanya dimuat sekali dan di-cache di memori.

    Returns:
        StableDiffusionXLPipeline instance.
    """
    global _pipeline
    if _pipeline is not None:
        return _pipeline

    logger.info("Memuat model Stable Diffusion: %s ...", settings.SD_MODEL_ID)

    from diffusers import AutoPipelineForText2Image  # noqa: lazy import

    _pipeline = AutoPipelineForText2Image.from_pretrained(
        settings.SD_MODEL_ID,
        torch_dtype=torch.float16 if settings.SD_DEVICE == "cuda" else torch.float32,
        variant="fp16" if settings.SD_DEVICE == "cuda" else None,
    )
    _pipeline.to(settings.SD_DEVICE)

    # Optimisasi memori jika menggunakan CPU
    if settings.SD_DEVICE == "cpu":
        _pipeline.enable_attention_slicing()

    logger.info("Model Stable Diffusion berhasil dimuat pada device: %s", settings.SD_DEVICE)
    return _pipeline


def generate_image(prompt: str, num_inference_steps: int = 4) -> str:
    """
    Generate gambar dari prompt teks menggunakan SDXL Turbo.

    Args:
        prompt:               Prompt teknis dalam bahasa Inggris.
        num_inference_steps:  Jumlah langkah inferensi (SDXL Turbo optimal di 1-4 step).

    Returns:
        String Base64-encoded dari gambar PNG hasil generate.
    """
    logger.info("Generating image dengan prompt: '%s'", prompt[:80])

    pipe = _get_pipeline()

    result = pipe(
        prompt=prompt,
        num_inference_steps=num_inference_steps,
        guidance_scale=0.0,  # SDXL Turbo tidak memerlukan guidance
        width=512,
        height=512,
    )

    image = result.images[0]

    # Konversi PIL Image → Base64
    buffer = BytesIO()
    image.save(buffer, format="PNG")
    base64_str = base64.b64encode(buffer.getvalue()).decode("utf-8")

    logger.info("Gambar berhasil di-generate (%d karakter base64)", len(base64_str))
    return base64_str
