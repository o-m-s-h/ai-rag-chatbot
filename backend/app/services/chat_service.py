from datetime import datetime
from bson import ObjectId

from app.services.retrieval_service import retrieve_relevant_chunks
from app.services.gemini_service import generate_answer
from app.database.mongodb import messages_collection

async def process_chat(
    conversation_id,
    current_user,
    user_message
):

    # CONVERSATION MEMORY
    previous_messages = []

    cursor = messages_collection.find(
        {"conversation_id": conversation_id}
    ).sort("created_at", -1).limit(3)

    async for msg in cursor:
        previous_messages.append(
            f"User: {msg['user_message']}\nAI: {msg['ai_response']}"
        )

    conversation_context = "\n".join(previous_messages)

    enhanced_query = f"""
Conversation History:
{conversation_context}

Current Question:
{user_message}
"""

    retrieved_chunks = retrieve_relevant_chunks(
        enhanced_query,
        conversation_id
    )

    context = "\n\n".join([
        chunk.page_content
        for chunk in retrieved_chunks
    ])

    # ✅ now passing conversation_context here too
    ai_response = generate_answer(
        user_message,
        context,
        conversation_context
    )

    chat_document = {
        "conversation_id": conversation_id,
        "user_id": current_user["user_id"],
        "user_message": user_message,
        "ai_response": ai_response,
        "sources": list(set([
            chunk.metadata["source"]
            for chunk in retrieved_chunks
        ])),
        "created_at": datetime.utcnow()
    }

    await messages_collection.insert_one(chat_document)

    return {
        "success": True,
        "answer": ai_response,
        "sources": chat_document["sources"]
    }