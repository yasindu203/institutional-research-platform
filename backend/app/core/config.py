from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Institutional Research Platform API"
    DATABASE_URL: str = "sqlite+aiosqlite:///./firs.db"
    OPENROUTER_API_KEY: str = ""
    TAVILY_API_KEY: str = ""

    class Config:
        env_file = ".env"

settings = Settings()
