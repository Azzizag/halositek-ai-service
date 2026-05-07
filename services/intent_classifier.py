"""
HaloSitek AI Microservice - Intent Classifier
================================================
Modul untuk mengklasifikasikan intent pengguna:
  • "text"  → pengguna menanyakan tentang arsitektur / FAQ
  • "image" → pengguna meminta visualisasi / gambar desain
"""

import re

# ─────────────────────────────────────────────
#  Daftar kata kunci pemicu intent "image"
# ─────────────────────────────────────────────
IMAGE_KEYWORDS: list[str] = [
    # Bahasa Indonesia
    "gambar", "gambarkan", "buatkan gambar", "visualisasi",
    "denah", "desain", "render", "sketsa", "ilustrasi",
    "tampilkan", "tunjukkan desain", "buat denah",
    "layout", "floor plan", "rancang", "rancangan",
    "fasad", "facade", "tampak depan", "tampak samping",
    "3d", "perspektif", "interior", "eksterior",
    # Bahasa Inggris
    "generate image", "draw", "create image", "design",
    "show me", "visualize", "blueprint", "sketch",
]


def classify_intent(message: str) -> str:
    """
    Klasifikasikan intent dari pesan pengguna.

    Args:
        message: Teks pesan dari pengguna.

    Returns:
        "image" jika pesan mengandung permintaan visualisasi,
        "text"  jika pesan adalah pertanyaan umum.
    """
    normalized = message.lower().strip()

    for keyword in IMAGE_KEYWORDS:
        # Gunakan word-boundary agar 'gambar' tidak cocok di 'menggambarkan' secara salah
        pattern = rf"\b{re.escape(keyword)}\b"
        if re.search(pattern, normalized):
            return "image"

    return "text"
