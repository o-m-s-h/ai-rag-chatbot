from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str
    REDIS_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # GEMINI_API_KEY: str
    OPENROUTER_API_KEY: str

    ENCRYPTION_KEY: str

    SUPABASE_URL: str
    SUPABASE_KEY: str
    SUPABASE_BUCKET: str

    CHROMA_API_KEY: str
    CHROMA_TENANT: str
    CHROMA_DATABASE: str

    class Config:
        env_file = ".env"

settings = Settings()