"""
HaloSitek AI Microservice - RAG Service
=======================================
Modul untuk mengambil referensi (retrieval) dari Vector Database (ChromaDB)
berdasarkan pertanyaan user.
"""

import os
import logging
from langchain_chroma import Chroma
from langchain_ollama import OllamaEmbeddings
from config import settings

logger = logging.getLogger(__name__)

CHROMA_DB_DIR = "./chroma_db"
EMBEDDING_MODEL = "nomic-embed-text"

# Singleton instance
_vectorstore = None

def _get_vectorstore():
    """Load ChromaDB secara lazy (hanya saat dibutuhkan)."""
    global _vectorstore
    if _vectorstore is not None:
        return _vectorstore

    if not os.path.exists(CHROMA_DB_DIR):
        logger.warning(f"Database RAG di {CHROMA_DB_DIR} tidak ditemukan. "
                       "AI akan menjawab tanpa referensi aturan bangunan. "
                       "Jalankan 'python ingest_documents.py' terlebih dahulu.")
        return None

    try:
        embeddings = OllamaEmbeddings(
            model=EMBEDDING_MODEL,
            base_url=settings.OLLAMA_BASE_URL
        )
        _vectorstore = Chroma(
            persist_directory=CHROMA_DB_DIR,
            embedding_function=embeddings
        )
        logger.info("Vector database (ChromaDB) berhasil diload.")
        return _vectorstore
    except Exception as e:
        logger.error(f"Gagal memuat vector database: {e}")
        return None

def get_relevant_context(query: str, k: int = 3) -> str:
    """
    Cari dokumen yang paling relevan dengan pertanyaan user.
    
    Args:
        query: Pertanyaan atau pesan user.
        k: Jumlah potongan dokumen (chunk) yang ingin diambil.
        
    Returns:
        String berisi gabungan teks dari dokumen yang relevan.
    """
    vectorstore = _get_vectorstore()
    if not vectorstore:
        return ""

    logger.info(f"Mencari referensi RAG untuk query: '{query[:50]}...'")
    try:
        # Lakukan pencarian similarity
        results = vectorstore.similarity_search(query, k=k)
        
        if not results:
            return ""

        # Gabungkan hasil pencarian menjadi satu teks context
        contexts = []
        for i, doc in enumerate(results):
            source = os.path.basename(doc.metadata.get("source", "Unknown PDF"))
            page = doc.metadata.get("page", "?")
            contexts.append(f"[Sumber: {source}, Hal: {page}]\n{doc.page_content}")
            
        final_context = "\n\n---\n\n".join(contexts)
        logger.info(f"Ditemukan {len(results)} referensi dari dokumen.")
        return final_context

    except Exception as e:
        logger.error(f"Error saat mencari referensi RAG: {e}")
        return ""
