from datetime import datetime

from app.services.retrieval_service import (
    retrieve_relevant_chunks
)

from app.services.gemini_service import (
    generate_answer
)

from app.database.mongodb import (
    messages_collection
)

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

        if msg["role"] == "user":

            previous_messages.append(
                f"User: {msg['content']}"
            )

        elif msg["role"] == "assistant":

            previous_messages.append(
                f"AI: {msg['content']}"
            )

    conversation_context = "\n".join(
        previous_messages
    )

    if len(previous_messages) > 0:

        latest_context = previous_messages[-1]

        enhanced_query = f"""
    Previous Context:
    {latest_context}

    Current Question:
    {user_message}
    """

    else:

        enhanced_query = user_message

    retrieved_chunks = retrieve_relevant_chunks(
        enhanced_query,
        conversation_id
    )

    context = "\n\n".join([
        chunk.page_content
        for chunk in retrieved_chunks
    ])

    ai_response = generate_answer(
        user_message,
        context,
        conversation_context
    )

    sources = list(set([
        chunk.metadata["source"]
        for chunk in retrieved_chunks
    ]))

    user_chat = {

        "conversation_id": conversation_id,

        "user_id": current_user["user_id"],

        "role": "user",

        "content": user_message,

        "timestamp": datetime.utcnow()
    }

    assistant_chat = {

        "conversation_id": conversation_id,

        "user_id": current_user["user_id"],

        "role": "assistant",

        "content": ai_response,

        "sources": sources,

        "timestamp": datetime.utcnow()
    }

    await messages_collection.insert_one(
        user_chat
    )

    await messages_collection.insert_one(
        assistant_chat
    )

    return {
        "success": True,
        "answer": ai_response,
        "sources": sources
    }