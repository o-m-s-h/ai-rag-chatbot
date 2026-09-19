from fastapi import APIRouter, Depends

from app.schemas.conversation_schema import (
    CreateConversationSchema
)

from app.services.conversation_service import (
    create_conversation,
    get_user_conversations,
    delete_conversation
)

from app.core.dependencies import get_current_user

router = APIRouter(
    prefix="/conversations",
    tags=["Conversations"]
)

@router.delete("/{conversation_id}")
async def delete_chat(conversation_id: str, current_user=Depends(get_current_user)):
    return await delete_conversation(conversation_id, current_user)

@router.post("/")
async def create_chat(
    data: CreateConversationSchema,
    current_user = Depends(get_current_user)
):

    return await create_conversation(
        data,
        current_user
    )

@router.get("/")
async def get_chats(
    current_user = Depends(get_current_user)
):

    return await get_user_conversations(
        current_user
    )
