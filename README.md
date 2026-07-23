# Indian Market Analytics Dashboard

A full-stack market analytics dashboard for Indian equity indices built with:

- Backend: FastAPI, SQLAlchemy, SQLite, pandas
- Frontend: React, Vite, Tailwind CSS, React Router, React Query

## Prerequisites

- Node.js 20+ and npm
- Python 3.11+ (workspace virtual environment is used)

## Setup

1. Install backend Python dependencies:

```powershell
cd backend
python -m pip install -r requirements.txt
```

2. Install frontend dependencies:

```powershell
cd frontend
npm install
```

## Data Import

Import the CSV data into the backend SQLite database:

```powershell
cd backend
python scripts/import_csv.py
```

This loads `backend/market.db` with NIFTY and SENSEX history from `backend/data`.

## Running the App

From the project root, start both backend and frontend together:

```powershell
cd c:\Users\laman\OneDrive\Desktop\stock
npm run dev
```

- Frontend: `http://localhost:6969`
- Backend API: `http://127.0.0.1:8000`

## Individual Services

### Backend only

```powershell
cd backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Frontend only

```powershell
cd frontend
npm run dev -- --port 6969
```

## Notes

- The backend configuration now resolves `backend/market.db` correctly.
- The root `npm run dev` command uses `concurrently` to launch both services.
- If ports are in use, `npm run dev` will kill stale services on `8000`, `6969`, `6970`, `6971`, and `6972`.

## API Endpoints

- `GET /dashboard`
- `GET /nifty`
- `GET /sensex`
- `GET /nifty/latest`
- `GET /sensex/latest`
- `GET /nifty/stats`
- `GET /sensex/stats`
- `GET /nifty/chart`
- `GET /sensex/chart`
