from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    app_name: str = "Indian Market Analytics Dashboard"
    database_url: str = f"sqlite:///{(BASE_DIR / 'market.db').resolve()}"

    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", env_file_encoding="utf-8")

    @field_validator("database_url", mode="before")
    @classmethod
    def normalize_database_url(cls, value: str) -> str:
        if not isinstance(value, str) or not value.startswith("sqlite:///"):
            return value

        path = value.removeprefix("sqlite:///")
        if not path:
            return value

        candidate_path = Path(path)
        if not candidate_path.is_absolute():
            candidate_path = (BASE_DIR / candidate_path).resolve()

        return f"sqlite:///{candidate_path}"


@lru_cache
def get_settings() -> Settings:
    return Settings()
