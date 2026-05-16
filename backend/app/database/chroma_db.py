import chromadb

from chromadb.config import Settings

from app.core.config import settings

client = chromadb.CloudClient(

    api_key=settings.CHROMA_API_KEY,

    tenant=settings.CHROMA_TENANT,

    database=settings.CHROMA_DATABASE
)

collection = client.get_or_create_collection(
    name="rag_collection"
)