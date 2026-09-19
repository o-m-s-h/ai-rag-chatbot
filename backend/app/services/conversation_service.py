from bson import ObjectId
from datetime import datetime
from fastapi import HTTPException
from starlette.concurrency import run_in_threadpool
from app.database.chroma_db import collection
from app.utils.redis_client import redis_client

from app.database.mongodb import (
    conversations_collection,
    messages_collection
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
            "created_at": convo["created_at"],
            "documents": convo.get("documents", [])
        })

    return conversations


async def delete_conversation(conversation_id, current_user):
    if not ObjectId.is_valid(conversation_id):
        raise HTTPException(status_code=404, detail="Conversation not found")

    query = {"_id": ObjectId(conversation_id), "user_id": current_user["user_id"]}
    if not await conversations_collection.find_one(query):
        raise HTTPException(status_code=404, detail="Conversation not found")

    # Keep the conversation until cleanup succeeds so a failed deletion can be retried.
    await run_in_threadpool(collection.delete, where={"conversation_id": conversation_id})
    await run_in_threadpool(redis_client.delete, f"bm25:{conversation_id}")
    await messages_collection.delete_many({"conversation_id": conversation_id})
    await conversations_collection.delete_one(query)
    return {"success": True}
