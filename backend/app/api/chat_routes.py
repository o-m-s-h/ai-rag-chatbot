from fastapi import (
    APIRouter,
    Depends
)

from app.schemas.chat_schema import (
    ChatSchema
)

from app.services.chat_service import (
    process_chat
)

from app.core.dependencies import (
    get_current_user
)

router = APIRouter(
    prefix="/chat",
    tags=["Chat"]
)

@router.post("/{conversation_id}")
async def chat_with_documents(

    conversation_id: str,

    data: ChatSchema,

    current_user = Depends(get_current_user)
):

    return await process_chat(
        conversation_id,
        current_user,
        data.message
    )