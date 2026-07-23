from pathlib import Path

import yfinance as yf

ROOT = Path(__file__).resolve().parent
OUTPUT_DIR = ROOT / "backend" / "data"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Download NIFTY
nifty = yf.download(
    "^NSEI",
    period="1y",
    interval="1d",
    auto_adjust=False,
    progress=False,
    multi_level_index=False,
)

# Download SENSEX
sensex = yf.download(
    "^BSESN",
    period="1y",
    interval="1d",
    auto_adjust=False,
    progress=False,
    multi_level_index=False,
)

nifty.to_csv(OUTPUT_DIR / "nifty50.csv", index=True)
sensex.to_csv(OUTPUT_DIR / "sensex.csv", index=True)

print(f"Done. Files written to {OUTPUT_DIR}")