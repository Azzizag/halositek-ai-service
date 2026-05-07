"""
HaloSitek AI Microservice - Schemas
====================================
Definisi Pydantic model untuk request dan response API.
"""

from typing import Literal
from pydantic import BaseModel, Field


# ─────────────────────────────────────────────
#  Skema yang dikirim DARI Laravel ke AI Service
# ─────────────────────────────────────────────

class ChatMessage(BaseModel):
    """Satu unit pesan dalam riwayat percakapan."""
    role: Literal["user", "assistant"] = Field(
        ..., description="Peran pengirim pesan"
    )
    content: str = Field(
        ..., description="Isi pesan"
    )


class GenerateRequest(BaseModel):
    """Payload yang diterima dari back-end Laravel."""
    user_id: str = Field(
        ..., description="ID unik pengguna dari MongoDB"
    )
    message: str = Field(
        ..., description="Pesan teks dari pengguna"
    )
    history: list[ChatMessage] = Field(
        default_factory=list,
        description="Konteks percakapan sebelumnya (opsional)"
    )


# ─────────────────────────────────────────────
#  Skema yang dikirim DARI AI Service ke Laravel
# ─────────────────────────────────────────────

class GenerateResponse(BaseModel):
    """Payload yang dikembalikan ke back-end Laravel."""
    type: Literal["text", "image"] = Field(
        ..., description="Jenis konten balasan: 'text' atau 'image'"
    )
    content: str = Field(
        ..., description="Teks balasan (jika type='text') atau data Base64 gambar (jika type='image')"
    )
    prompt_used: str | None = Field(
        default=None,
        description="Prompt teknis yang digunakan untuk generate gambar (hanya jika type='image')"
    )
