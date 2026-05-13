from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str

    JWT_SECRET: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int

    # GEMINI_API_KEY: str
    OPENROUTER_API_KEY: str

    ENCRYPTION_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()