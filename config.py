"""
HaloSitek AI Microservice - Configuration
==========================================
Konfigurasi terpusat menggunakan Pydantic Settings.
"""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Konfigurasi aplikasi, dibaca dari environment variables / .env file."""

    # --- Aplikasi ---
    APP_NAME: str = "HaloSitek AI Microservice"
    APP_VERSION: str = "0.1.0"
    DEBUG: bool = False

    # --- Ollama ---
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3"

    # --- Stable Diffusion ---
    SD_MODEL_ID: str = "stabilityai/sdxl-turbo"
    SD_DEVICE: str = "cpu"  # "cuda" jika tersedia GPU NVIDIA

    # --- Server ---
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
