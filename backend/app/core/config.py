from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str
    REDIS_URL: str
    JWT_SECRET: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    GEMINI_API_KEY: str
    GEMINI_MODEL: str

    ENCRYPTION_KEY: str

    CHROMA_API_KEY: str
    CHROMA_TENANT: str
    CHROMA_DATABASE: str

    class Config:
        env_file = ".env"
        # Allow old .env entries, including removed Supabase settings.
        extra = "ignore"

settings = Settings()
