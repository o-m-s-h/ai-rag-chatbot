from pydantic import BaseModel

class CreateConversationSchema(BaseModel):
    title: str