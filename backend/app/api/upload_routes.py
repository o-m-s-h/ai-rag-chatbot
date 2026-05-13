from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)

import chromadb

from app.services.upload_service import (
    upload_document
)

from app.core.dependencies import (
    get_current_user
)

router = APIRouter(
    prefix="/upload",
    tags=["Upload", "Debug"]
)

# ChromaDB client
client = chromadb.PersistentClient(
    path="./chroma_storage"
)

collection = client.get_collection(
    name="rag_collection"
)

# =========================
# Upload Route
# =========================
@router.post("/{conversation_id}")
async def upload_file(

    conversation_id: str,

    file: UploadFile = File(...),

    current_user=Depends(get_current_user)

):

    return await upload_document(
        conversation_id,
        current_user,
        file
    )


# =========================
# Debug Route
# =========================
@router.get("/debug/chroma")
async def debug_chroma():

    data = collection.get()

    return {
        "total_chunks": len(data["documents"]),
        "sample_chunks": data["documents"][:5]
    }