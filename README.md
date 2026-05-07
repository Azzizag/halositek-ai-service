# 🏗️ HaloSitek AI Microservice

AI Microservice untuk platform konsultasi arsitektur **HaloSitek**.  
Service ini menerima request dari back-end Laravel, memproses teks menggunakan LLM lokal (Ollama), dan menghasilkan gambar arsitektural menggunakan Stable Diffusion.

## Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Framework API | FastAPI (Python 3.10+) |
| LLM (Teks) | Ollama + Llama 3 |
| Image Gen | Stable Diffusion XL Turbo (diffusers) |
| Komunikasi | REST API, JSON |

## Prasyarat

Pastikan sudah terinstal di komputer kamu:

- **Python 3.10+** → [Download](https://www.python.org/downloads/)
- **Ollama** → [Download](https://ollama.com/download)
- **Git** → [Download](https://git-scm.com/downloads)

## Cara Menjalankan

### 1. Clone Repository

```bash
git clone https://github.com/<USERNAME>/<REPO_NAME>.git
cd <REPO_NAME>
```

### 2. Buat Virtual Environment & Install Dependencies

```bash
python3 -m venv venv
source venv/bin/activate        # Mac/Linux
# venv\Scripts\activate         # Windows

pip install -r requirements.txt
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
```

Isi file `.env` sesuai kebutuhan (default sudah bisa langsung jalan).

### 4. Jalankan Ollama & Download Model

```bash
ollama serve                    # Jalankan Ollama di background
ollama pull llama3              # Download model Llama 3 (~4.7GB, sekali saja)
```

### 5. Jalankan Server

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server akan berjalan di: **http://localhost:8000**

### 6. Test

Buka **Swagger UI** di browser: http://localhost:8000/docs

Atau test via terminal:

```bash
# Health Check
curl http://localhost:8000/health

# Test Teks
curl -X POST http://localhost:8000/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_001",
    "message": "Apa itu pondasi cakar ayam?",
    "history": []
  }'

# Test Gambar (lama di CPU, 5-15 menit)
curl -X POST http://localhost:8000/api/v1/generate \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "user_001",
    "message": "Buatkan gambar denah rumah minimalis",
    "history": []
  }'
```

## Endpoint API

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| `GET` | `/health` | Cek status service |
| `POST` | `/api/v1/generate` | Generate respons AI (teks/gambar) |
| `GET` | `/docs` | Swagger UI |

## Struktur Proyek

```
├── main.py                    # Entry point FastAPI
├── config.py                  # Konfigurasi (env vars)
├── schemas.py                 # Model request/response
├── requirements.txt           # Dependencies
├── .env.example               # Template environment
├── dataset_halositek.jsonl    # Dataset FAQ arsitektur
├── API_DOCUMENTATION.md       # Dokumentasi API untuk backend
├── ARCHITECTURE.md            # Arsitektur & tech stack
└── services/
    ├── intent_classifier.py   # Klasifikasi intent (teks/gambar)
    ├── ollama_service.py      # Koneksi ke Ollama LLM
    └── image_generator.py     # Pipeline Stable Diffusion
```

## Dokumentasi Lengkap

- [API Documentation](./API_DOCUMENTATION.md) — Panduan integrasi untuk developer backend
- [Architecture](./ARCHITECTURE.md) — Arsitektur sistem & tech stack

## Troubleshooting

| Masalah | Solusi |
|---------|--------|
| `Connection refused` ke Ollama | Pastikan `ollama serve` sudah berjalan |
| Model belum ada | Jalankan `ollama pull llama3` |
| Import error | Pastikan virtual environment aktif & `pip install -r requirements.txt` |
| Gambar lama di-generate | Normal di CPU (5-15 menit). Gunakan GPU untuk lebih cepat |
