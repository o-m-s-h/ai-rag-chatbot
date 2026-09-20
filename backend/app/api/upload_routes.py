from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)

from app.database.chroma_db import collection

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
def debug_chroma(current_user=Depends(get_current_user)):

    data = collection.get(
        where={"user_id": current_user["user_id"]},
        include=["documents"]
    )

    return {
        "total_chunks": len(data["ids"]),
        "sample_chunks": data["documents"][:5]
    }
