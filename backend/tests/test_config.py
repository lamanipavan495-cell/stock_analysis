from pathlib import Path
import sys

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from app.core.config import Settings


def test_default_database_url_is_absolute_and_backend_local():
    settings = Settings()
    db_path = Path(settings.database_url.removeprefix("sqlite:///"))

    assert db_path.is_absolute()
    assert db_path.name == "market.db"
    assert db_path.parent == Path(__file__).resolve().parents[1].resolve()
