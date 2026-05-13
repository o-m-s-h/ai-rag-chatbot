from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth_routes import router as auth_router
from app.api.user_routes import router as user_router
from app.api.conversation_routes import router as conversation_router
from app.api.upload_routes import router as upload_router
from app.api.chat_routes import router as chat_router

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(conversation_router)
app.include_router(upload_router)
app.include_router(chat_router)

@app.get("/")
def home():
    return {"message": "AI RAG Backend Running"}