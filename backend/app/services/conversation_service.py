from bson import ObjectId
from datetime import datetime

from app.database.mongodb import (
    conversations_collection
)

async def create_conversation(
    data,
    current_user
):

    conversation = {
        "user_id": current_user["user_id"],
        "title": data.title,
        "created_at": datetime.utcnow()
    }

    result = await conversations_collection.insert_one(
        conversation
    )

    return {
        "success": True,
        "conversation_id": str(result.inserted_id),
        "title": data.title
    }

async def get_user_conversations(current_user):

    conversations = []

    cursor = conversations_collection.find({
        "user_id": current_user["user_id"]
    })

    async for convo in cursor:

        conversations.append({
            "conversation_id": str(convo["_id"]),
            "title": convo["title"],
            "created_at": convo["created_at"]
        })

    return conversations