from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.dependencies import get_session
from app.services.index_history_service import IndexHistoryService

router = APIRouter()


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_session)):
    service = IndexHistoryService(db)
    return service.build_dashboard_summary()


@router.get("/nifty")
def get_nifty(db: Session = Depends(get_session)):
    service = IndexHistoryService(db)
    return service.get_all("NIFTY50")


@router.get("/sensex")
def get_sensex(db: Session = Depends(get_session)):
    service = IndexHistoryService(db)
    return service.get_all("SENSEX")


@router.get("/nifty/latest")
def get_latest_nifty(db: Session = Depends(get_session)):
    service = IndexHistoryService(db)
    latest = service.get_latest("NIFTY50")
    if not latest:
        raise HTTPException(404, "No data")
    return latest


@router.get("/sensex/latest")
def get_latest_sensex(db: Session = Depends(get_session)):
    service = IndexHistoryService(db)
    latest = service.get_latest("SENSEX")
    if not latest:
        raise HTTPException(404, "No data")
    return latest


@router.get("/nifty/stats")
def get_nifty_stats(db: Session = Depends(get_session)):
    service = IndexHistoryService(db)
    return service.get_stats("NIFTY50")


@router.get("/sensex/stats")
def get_sensex_stats(db: Session = Depends(get_session)):
    service = IndexHistoryService(db)
    return service.get_stats("SENSEX")


@router.get("/nifty/chart")
def get_nifty_chart(db: Session = Depends(get_session)):
    service = IndexHistoryService(db)
    return service.build_chart_data("NIFTY50")


@router.get("/sensex/chart")
def get_sensex_chart(db: Session = Depends(get_session)):
    service = IndexHistoryService(db)
    return service.build_chart_data("SENSEX")
