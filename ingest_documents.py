"""
Script untuk memproses dokumen PDF (Aturan Bangunan) dan menyimpannya 
ke dalam Vector Database (ChromaDB) agar bisa digunakan oleh AI (RAG).

Cara pakai:
1. Pastikan Ollama menyala dan sudah mendownload model 'nomic-embed-text'
   (Jalankan: ollama pull nomic-embed-text)
2. Jalankan script ini: python ingest_documents.py
"""

import os
import logging
from glob import glob
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaEmbeddings
from langchain_chroma import Chroma
from config import settings

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Konfigurasi Path
PDF_DIR = "./Dokumen Aturan Bangunan"
CHROMA_DB_DIR = "./chroma_db"
EMBEDDING_MODEL = "nomic-embed-text"

def main():
    # 1. Cari semua file PDF di folder
    pdf_files = glob(os.path.join(PDF_DIR, "*.pdf"))
    if not pdf_files:
        logger.error(f"Tidak ada file PDF ditemukan di folder '{PDF_DIR}'")
        return

    logger.info(f"Ditemukan {len(pdf_files)} file PDF. Mulai memproses...")

    # 2. Load dokumen
    documents = []
    for pdf_path in pdf_files:
        logger.info(f"Membaca {os.path.basename(pdf_path)}...")
        try:
            loader = PyPDFLoader(pdf_path)
            docs = loader.load()
            documents.extend(docs)
        except Exception as e:
            logger.error(f"Gagal membaca {pdf_path}: {e}")

    logger.info(f"Total halaman terbaca: {len(documents)}")

    # 3. Potong teks menjadi chunk kecil agar mudah dicari (chunk_size=1000 karakter)
    logger.info("Memotong teks menjadi chunk...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200, # overlap agar kalimat yang terpotong tidak kehilangan konteks
        separators=["\n\n", "\n", ".", " ", ""]
    )
    chunks = text_splitter.split_documents(documents)
    logger.info(f"Berhasil membuat {len(chunks)} chunks.")

    # 4. Buat Embeddings menggunakan Ollama
    logger.info(f"Menghubungkan ke Ollama untuk embedding model '{EMBEDDING_MODEL}'...")
    embeddings = OllamaEmbeddings(
        model=EMBEDDING_MODEL,
        base_url=settings.OLLAMA_BASE_URL
    )

    # 5. Simpan ke ChromaDB (dengan Batching agar tidak error max_batch_size)
    logger.info(f"Menyimpan ke Vector Database (ChromaDB) di folder '{CHROMA_DB_DIR}'...")
    
    batch_size = 5000
    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i + batch_size]
        logger.info(f"Memproses batch {i//batch_size + 1} (menyimpan {len(batch)} chunks)...")
        Chroma.from_documents(
            documents=batch,
            embedding=embeddings,
            persist_directory=CHROMA_DB_DIR
        )

    logger.info("✅ Selesai! Dokumen berhasil di-ingest ke database.")
    logger.info("Sekarang AI dapat mencari referensi aturan bangunan dari database ini.")

if __name__ == "__main__":
    main()
