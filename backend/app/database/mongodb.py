from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

client = AsyncIOMotorClient(settings.MONGO_URI)

db = client["ai_rag_chatbot"]

users_collection = db["users"]
conversations_collection = db["conversations"]
messages_collection = db["messages"]