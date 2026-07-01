from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./resilience_dev.db"
    SECRET_KEY: str = "dev-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    AZURE_SPEECH_KEY: str = ""
    AZURE_SPEECH_REGION: str = "eastus"
    ENVIRONMENT: str = "development"

    class Config:
        env_file = ".env"


settings = Settings()
