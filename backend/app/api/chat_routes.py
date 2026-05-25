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

from app.database.mongodb import (
    messages_collection
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

@router.get("/{conversation_id}/messages")
async def get_messages(

    conversation_id: str,

    current_user = Depends(get_current_user)
):

    messages = []

    cursor = messages_collection.find(
        {
            "conversation_id": conversation_id,
            "user_id": current_user["user_id"]
        }
    )

    async for message in cursor:

        # NEW SCHEMA
        if "role" in message:

            formatted_message = {

                "role": message["role"],

                "content": message["content"],

                "timestamp": message["timestamp"]
            }

            if message["role"] == "assistant":

                formatted_message["sources"] = message.get(
                    "sources",
                    []
                )

            messages.append(
                formatted_message
            )

        # OLD SCHEMA
        else:

            messages.append({

                "role": "user",

                "content": message.get(
                    "user_message",
                    ""
                ),

                "timestamp": message.get(
                    "created_at"
                )
            })

            messages.append({

                "role": "assistant",

                "content": message.get(
                    "ai_response",
                    ""
                ),

                "sources": message.get(
                    "sources",
                    []
                ),

                "timestamp": message.get(
                    "created_at"
                )
            })

    return sorted(
        messages,
        key=lambda x: x["timestamp"]
    )