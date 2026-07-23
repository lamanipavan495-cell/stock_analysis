from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import yfinance as yf
import pandas as pd

from app.database.base import Base
from app.database.session import SessionLocal, engine
from app.services.index_history_service import IndexHistoryService


INDEX_TICKERS = {
    "NIFTY50": "^NSEI",
    "SENSEX": "^BSESN",
}


def main() -> None:
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        service = IndexHistoryService(db)
        for index_name, ticker in INDEX_TICKERS.items():
            data = yf.download(ticker, period="2d", interval="1d", auto_adjust=False, progress=False, multi_level_index=False)
            if data.empty:
                continue
            frame = data.reset_index()
            frame = frame.rename(columns={"Date": "date", "Open": "open", "High": "high", "Low": "low", "Close": "close", "Adj Close": "adj_close", "Volume": "volume"})
            frame["date"] = pd.to_datetime(frame["date"]).dt.date
            frame["daily_change"] = frame["close"].diff()
            frame["daily_change_percent"] = frame["close"].pct_change() * 100
            latest = frame.iloc[-1]
            if service.repository.exists(index_name, latest["date"]):
                print(f"Skipping duplicate {index_name} for {latest['date']}")
                continue
            service.upsert_records([
                {
                    "index_name": index_name,
                    "date": latest["date"],
                    "open": float(latest["open"]),
                    "high": float(latest["high"]),
                    "low": float(latest["low"]),
                    "close": float(latest["close"]),
                    "adj_close": float(latest["adj_close"]),
                    "volume": int(latest["volume"]),
                    "daily_change": float(latest["daily_change"]),
                    "daily_change_percent": float(latest["daily_change_percent"]),
                }
            ])
            print(f"Updated {index_name} on {latest['date']}")
    finally:
        db.close()


if __name__ == "__main__":
    main()
