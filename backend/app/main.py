import os
import pandas as pd
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, List, Dict, Any

from .data_loader import db
from .schemas import (
    HealthResponse,
    MetricsResponse,
    PriorityPredictionRequest,
    PriorityPredictionResponse
)
from .services import compute_metrics, get_recommendation_for_task, predict_maintenance_priority

app = FastAPI(
    title="RailWise AI Railway Block Planning Backend",
    description="REST API service for SIH26027 Automatic Block Planning & Section Throughput Optimizer",
    version="1.0.0"
)

# Configure CORS
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
if allowed_origins_env == "*":
    origins = ["*"]
else:
    origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def ensure_db_loaded_middleware(request, call_next):
    if not db.is_loaded:
        db.load_all_data()
    response = await call_next(request)
    return response

@app.on_event("startup")
def startup_event():
    """Load backend CSV data and models into memory at application boot."""
    if not db.is_loaded:
        db.load_all_data()

@app.get("/api/health", response_model=HealthResponse)
def health_check():
    """Returns backend service health status."""
    if not db.is_loaded:
        db.load_all_data()
    return HealthResponse(
        status="ok",
        service="RailWise backend",
        data_loaded=db.is_loaded,
        total_recommendations=len(db.final_recommendations_df),
        total_conflicts=len(db.conflict_analysis_df),
        model_loaded=db.model is not None
    )

@app.get("/api/metrics", response_model=MetricsResponse)
def get_dashboard_metrics():
    """Returns headline dashboard operational metrics derived from backend AI engine outputs."""
    metrics = compute_metrics()
    return MetricsResponse(**metrics)

@app.get("/api/maintenance")
def get_maintenance_tasks(
    corridor_id: Optional[str] = Query(None, description="Filter by corridor ID"),
    department: Optional[str] = Query(None, description="Filter by department"),
    status: Optional[str] = Query(None, description="Filter by task status"),
    severity: Optional[str] = Query(None, description="Filter by severity"),
    priority_category: Optional[str] = Query(None, description="Filter by priority category"),
    limit: int = Query(1000, ge=1, le=20000, description="Max records to return")
):
    """Returns maintenance tasks with filter support."""
    df = db.unified_maintenance_df if not db.unified_maintenance_df.empty else db.task_predictions_df
    if df.empty:
        return []

    filtered = df.copy()
    if corridor_id and 'corridor_id' in filtered:
        filtered = filtered[filtered['corridor_id'].astype(str).str.upper() == corridor_id.upper()]
    if department and 'department' in filtered and department.upper() != 'ALL':
        filtered = filtered[filtered['department'].astype(str).str.upper() == department.upper()]
    if status and 'status' in filtered and status.upper() != 'ALL':
        filtered = filtered[filtered['status'].astype(str).str.upper() == status.upper()]
    if severity and 'severity' in filtered and severity.upper() != 'ALL':
        filtered = filtered[filtered['severity'].astype(str).str.upper() == severity.upper()]

    records = filtered.head(limit).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
    return records

@app.get("/api/maintenance/{task_id}")
def get_maintenance_task_detail(task_id: str):
    """Returns full details for a single maintenance task."""
    df = db.unified_maintenance_df if not db.unified_maintenance_df.empty else db.task_predictions_df
    if df.empty:
        raise HTTPException(status_code=404, detail="Maintenance dataset not loaded")

    match = df[df['task_id'].astype(str) == str(task_id)]
    if match.empty:
        raise HTTPException(status_code=404, detail=f"Task ID '{task_id}' not found")

    rec = get_recommendation_for_task(task_id)
    task_dict = match.iloc[0].to_dict()
    task_dict['recommendation'] = rec
    return {k: (None if pd.isna(v) else v) for k, v in task_dict.items()}

@app.get("/api/risk")
def get_asset_risk_predictions(
    department: Optional[str] = Query(None),
    priority_category: Optional[str] = Query(None),
    limit: int = Query(1000, ge=1, le=10000)
):
    """Returns asset risk and maintenance priority predictions from asset_risk_predictions.csv."""
    df = db.asset_risk_df if not db.asset_risk_df.empty else db.task_predictions_df
    if df.empty:
        return []

    filtered = df.copy()
    if department and department.upper() != 'ALL' and 'department' in filtered:
        filtered = filtered[filtered['department'].astype(str).str.upper() == department.upper()]
    if priority_category and priority_category.upper() != 'ALL' and 'priority_category' in filtered:
        filtered = filtered[filtered['priority_category'].astype(str).str.upper() == priority_category.upper()]

    records = filtered.head(limit).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
    return records

@app.get("/api/candidates")
def get_candidate_blocks(
    task_id: Optional[str] = Query(None),
    block_request_id: Optional[str] = Query(None),
    corridor_id: Optional[str] = Query(None),
    limit: int = Query(1000, ge=1, le=10000)
):
    """Returns candidate block windows from candidate_blocks.csv."""
    df = db.candidate_blocks_df
    if df.empty:
        return []

    filtered = df.copy()
    if task_id and 'task_id' in filtered:
        filtered = filtered[filtered['task_id'].astype(str) == str(task_id)]
    if block_request_id and 'block_request_id' in filtered:
        filtered = filtered[filtered['block_request_id'].astype(str) == str(block_request_id)]
    if corridor_id and 'corridor_id' in filtered:
        filtered = filtered[filtered['corridor_id'].astype(str).str.upper() == corridor_id.upper()]

    records = filtered.head(limit).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
    return records

@app.get("/api/conflicts")
def get_conflicts(
    candidate_id: Optional[int] = Query(None),
    task_id: Optional[str] = Query(None),
    block_request_id: Optional[str] = Query(None),
    corridor_id: Optional[str] = Query(None),
    limit: int = Query(1000, ge=1, le=10000)
):
    """Returns train conflict analysis details from conflict_analysis.csv (743 total conflicts)."""
    df = db.conflict_analysis_df
    if df.empty:
        return []

    filtered = df.copy()
    if candidate_id is not None and 'candidate_id' in filtered:
        filtered = filtered[filtered['candidate_id'] == candidate_id]
    if task_id and 'task_id' in filtered:
        filtered = filtered[filtered['task_id'].astype(str) == str(task_id)]
    if block_request_id and 'block_request_id' in filtered:
        filtered = filtered[filtered['block_request_id'].astype(str) == str(block_request_id)]
    if corridor_id and 'corridor_id' in filtered:
        filtered = filtered[filtered['corridor_id'].astype(str).str.upper() == corridor_id.upper()]

    records = filtered.head(limit).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
    return records

@app.get("/api/recommendations")
def get_recommendations(
    corridor_id: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    request_status: Optional[str] = Query(None),
    feasibility: Optional[str] = Query(None),
    priority_category: Optional[str] = Query(None),
    limit: int = Query(1000, ge=1, le=10000)
):
    """Returns final AI recommendations from railwise_final_recommendations.csv (6000 records)."""
    df = db.final_recommendations_df
    if df.empty:
        return []

    filtered = df.copy()
    if corridor_id and 'corridor_id' in filtered:
        filtered = filtered[filtered['corridor_id'].astype(str).str.upper() == corridor_id.upper()]
    if department and 'department' in filtered and department.upper() != 'ALL':
        filtered = filtered[filtered['department'].astype(str).str.upper() == department.upper()]
    if request_status and 'request_status' in filtered and request_status.upper() != 'ALL':
        filtered = filtered[filtered['request_status'].astype(str).str.upper() == request_status.upper()]
    if feasibility and 'feasibility' in filtered and feasibility.upper() != 'ALL':
        filtered = filtered[filtered['feasibility'].astype(str).str.upper() == feasibility.upper()]
    if priority_category and 'priority_category' in filtered and priority_category.upper() != 'ALL':
        filtered = filtered[filtered['priority_category'].astype(str).str.upper() == priority_category.upper()]

    records = filtered.head(limit).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
    return records

@app.get("/api/optimized-blocks")
def get_optimized_blocks(
    corridor_id: Optional[str] = Query(None),
    feasibility: Optional[str] = Query(None),
    limit: int = Query(1000, ge=1, le=10000)
):
    """Returns optimized block allocations from optimized_blocks.csv or railwise_final_recommendations.csv."""
    df = db.optimized_blocks_df if not db.optimized_blocks_df.empty else db.final_recommendations_df
    if df.empty:
        return []

    filtered = df.copy()
    if corridor_id and 'corridor_id' in filtered:
        filtered = filtered[filtered['corridor_id'].astype(str).str.upper() == corridor_id.upper()]
    if feasibility and 'feasibility' in filtered:
        filtered = filtered[filtered['feasibility'].astype(str).str.upper() == feasibility.upper()]

    records = filtered.head(limit).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
    return records

@app.get("/api/recommendations/{task_id}")
def get_task_recommendation(task_id: str):
    """Returns the primary final recommendation for a task ID or request ID."""
    rec = get_recommendation_for_task(task_id)
    if not rec:
        raise HTTPException(status_code=404, detail=f"No recommendation found for ID '{task_id}'")
    return rec

@app.get("/api/baseline-comparison")
def get_baseline_comparison(limit: int = Query(1000, ge=1, le=5000)):
    """Returns historical/manual vs AI optimized plan comparison metrics from baseline_comparison.csv."""
    df = db.baseline_comparison_df
    if df.empty:
        return []

    records = df.head(limit).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
    return records

@app.get("/api/block-requests")
def get_block_requests(
    corridor_id: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    request_status: Optional[str] = Query(None),
    limit: int = Query(1000, ge=1, le=10000)
):
    """Returns block requests from block_requests.csv."""
    df = db.block_requests_df
    if df.empty:
        return []

    filtered = df.copy()
    if corridor_id and 'corridor_id' in filtered:
        filtered = filtered[filtered['corridor_id'].astype(str).str.upper() == corridor_id.upper()]
    if department and 'department' in filtered and department.upper() != 'ALL':
        filtered = filtered[filtered['department'].astype(str).str.upper() == department.upper()]
    if request_status and 'request_status' in filtered and request_status.upper() != 'ALL':
        filtered = filtered[filtered['request_status'].astype(str).str.upper() == request_status.upper()]

    records = filtered.head(limit).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
    return records

@app.get("/api/assets")
@app.get("/api/asset-master")
def get_assets(
    corridor_id: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    asset_type: Optional[str] = Query(None),
    limit: int = Query(1000, ge=1, le=20000)
):
    """Returns infrastructure asset records from asset_master.csv."""
    df = db.asset_master_df
    if df.empty:
        return []

    filtered = df.copy()
    if corridor_id and 'corridor_id' in filtered:
        filtered = filtered[filtered['corridor_id'].astype(str).str.upper() == corridor_id.upper()]
    if department and 'department' in filtered and department.upper() != 'ALL':
        filtered = filtered[filtered['department'].astype(str).str.upper() == department.upper()]
    if asset_type and 'asset_type' in filtered and asset_type.upper() != 'ALL':
        filtered = filtered[filtered['asset_type'].astype(str).str.upper() == asset_type.upper()]

    records = filtered.head(limit).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
    return records

@app.get("/api/coa-availability")
def get_coa_availability(
    corridor_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    limit: int = Query(1000, ge=1, le=10000)
):
    """Returns COA block availability records from coa_block_availability.csv."""
    df = db.coa_availability_df
    if df.empty:
        return []

    filtered = df.copy()
    if corridor_id and 'corridor_id' in filtered and corridor_id.upper() != 'ALL':
        filtered = filtered[filtered['corridor_id'].astype(str).str.upper() == corridor_id.upper()]
    if status and 'availability_status' in filtered and status.upper() != 'ALL':
        filtered = filtered[filtered['availability_status'].astype(str).str.upper() == status.upper()]

    records = filtered.head(limit).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
    return records

@app.get("/api/goods-forecast")
def get_goods_forecast(
    corridor_id: Optional[str] = Query(None),
    limit: int = Query(1000, ge=1, le=10000)
):
    """Returns goods train forecast records from goods_train_forecast.csv."""
    df = db.goods_forecast_df
    if df.empty:
        return []

    filtered = df.copy()
    if corridor_id and 'corridor_id' in filtered and corridor_id.upper() != 'ALL':
        filtered = filtered[filtered['corridor_id'].astype(str).str.upper() == corridor_id.upper()]

    records = filtered.head(limit).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
    return records

@app.get("/api/historical-plans")
def get_historical_plans(
    planning_method: Optional[str] = Query(None),
    limit: int = Query(1000, ge=1, le=10000)
):
    """Returns historical block plan comparison records from historical_block_plans.csv."""
    df = db.historical_plans_df
    if df.empty:
        return []

    filtered = df.copy()
    if planning_method and 'planning_method' in filtered and planning_method.upper() != 'ALL':
        filtered = filtered[filtered['planning_method'].astype(str).str.upper() == planning_method.upper()]

    records = filtered.head(limit).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
    return records

@app.get("/api/movement-windows")
def get_movement_windows(
    corridor_id: Optional[str] = Query(None),
    limit: int = Query(1000, ge=1, le=20000)
):
    """Returns train movement windows from train_movement_windows.csv."""
    df = db.movement_windows_df
    if df.empty:
        return []

    filtered = df.copy()
    if corridor_id and 'corridor_id' in filtered and corridor_id.upper() != 'ALL':
        filtered = filtered[filtered['corridor_id'].astype(str).str.upper() == corridor_id.upper()]

    records = filtered.head(limit).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
    return records

@app.get("/api/train-schedule")
def get_train_schedule(
    corridor_id: Optional[str] = Query(None),
    train_no: Optional[int] = Query(None),
    train_type: Optional[str] = Query(None),
    limit: int = Query(1000, ge=1, le=10000)
):
    """Returns actual train timetable entries from train_schedule.csv."""
    df = db.train_schedule_df
    if df.empty:
        return []

    filtered = df.copy()
    if train_no and 'train_no' in filtered:
        filtered = filtered[filtered['train_no'] == train_no]
    if train_type and 'train_type' in filtered and train_type.upper() != 'ALL':
        filtered = filtered[filtered['train_type'].astype(str).str.upper() == train_type.upper()]

    records = filtered.head(limit).replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')
    return records

@app.get("/api/corridors")
def get_corridors():
    """Returns list of all rail corridors from corridors.csv."""
    df = db.corridors_df
    if df.empty:
        return []
    return df.replace({pd.NA: None, float('nan'): None}).to_dict(orient='records')

@app.post("/api/predict-priority", response_model=PriorityPredictionResponse)
def predict_priority(req: PriorityPredictionRequest):
    """Predicts maintenance priority score using XGBoost model or precomputed model matrix."""
    res = predict_maintenance_priority(req.dict())
    return PriorityPredictionResponse(**res)
