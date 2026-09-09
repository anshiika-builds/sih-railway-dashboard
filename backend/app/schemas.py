from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class HealthResponse(BaseModel):
    status: str
    service: str
    data_loaded: bool
    total_recommendations: int
    total_conflicts: int
    model_loaded: bool

class MetricsResponse(BaseModel):
    requests_analyzed: int
    conflicts_detected: int
    conflicts_resolved: int
    delay_saved_min: float
    active_corridors: int
    pending_requests: int
    network_availability_pct: float
    ai_conflict_reduction_pct: float
    optimized_blocks: int
    deferred_tasks: int
    no_feasible_blocks: int
    system_status: str

class MaintenanceTask(BaseModel):
    task_id: str
    asset_id: str
    asset_type: Optional[str] = None
    department: Optional[str] = None
    corridor_id: Optional[str] = None
    location_km: Optional[float] = None
    defect_or_task: Optional[str] = None
    severity: Optional[str] = None
    criticality_1_5: Optional[int] = None
    safety_risk_1_5: Optional[int] = None
    operational_impact_1_5: Optional[int] = None
    overdue_days: Optional[int] = None
    estimated_duration_min: Optional[int] = None
    required_team_size: Optional[int] = None
    possession_required: Optional[str] = None
    maintenance_type: Optional[str] = None
    status: Optional[str] = None
    predicted_priority: Optional[float] = None
    priority_category: Optional[str] = None

class AssetRisk(BaseModel):
    task_id: str
    asset_id: str
    asset_type: Optional[str] = None
    department: Optional[str] = None
    corridor_id: Optional[str] = None
    location_km: Optional[float] = None
    criticality_1_5: Optional[int] = None
    safety_risk_1_5: Optional[int] = None
    operational_impact_1_5: Optional[int] = None
    overdue_days: Optional[int] = None
    severity: Optional[str] = None
    predicted_priority: float
    priority_category: str

class CandidateBlock(BaseModel):
    block_request_id: Optional[str] = None
    task_id: Optional[str] = None
    asset_id: Optional[str] = None
    corridor_id: Optional[str] = None
    block_window_id: Optional[str] = None
    block_date: Optional[str] = None
    start_min: Optional[int] = None
    end_min: Optional[int] = None
    duration_min: Optional[int] = None
    predicted_priority: Optional[float] = None
    priority_category: Optional[str] = None
    department: Optional[str] = None
    possession_required: Optional[str] = None
    candidate_id: Optional[int] = None
    train_conflicts: Optional[int] = None
    total_conflict_duration_min: Optional[float] = None
    forecast_date: Optional[str] = None
    forecast_goods_trains: Optional[float] = None
    peak_period: Optional[str] = None
    confidence_pct: Optional[float] = None

class ConflictDetail(BaseModel):
    candidate_id: Optional[int] = None
    block_request_id: Optional[str] = None
    task_id: Optional[str] = None
    block_window_id: Optional[str] = None
    corridor_id: Optional[str] = None
    train_no: Optional[Any] = None
    movement_id: Optional[str] = None
    movement_type: Optional[str] = None
    movement_start: Optional[Any] = None
    movement_end: Optional[Any] = None
    conflict_buffer_min: Optional[float] = None
    conflict_duration_min: Optional[float] = None

class RecommendationDetail(BaseModel):
    block_request_id: str
    task_id: str
    asset_id: str
    department: Optional[str] = None
    corridor_id: str
    predicted_priority: float
    priority_category: str
    requested_duration_min: Optional[float] = None
    recommended_date: Optional[str] = None
    recommended_start: Optional[str] = None
    recommended_end: Optional[str] = None
    recommended_duration_min: int
    train_conflict_count: int
    conflict_duration_min: float
    forecast_goods_trains: float
    affected_trains: Optional[str] = None
    feasibility: str
    request_status: str
    reason_for_recommendation: str

class BaselineComparisonItem(BaseModel):
    block_request_id: Optional[str] = None
    task_id: Optional[str] = None
    asset_id: Optional[str] = None
    corridor_id: Optional[str] = None
    block_window_id: Optional[str] = None
    block_date: Optional[str] = None
    train_conflicts: Optional[float] = None
    total_conflict_duration_min: Optional[float] = None
    recommended_start: Optional[str] = None
    recommended_end: Optional[str] = None
    optimized_utilization_pct: Optional[float] = None
    historical_conflict_count: Optional[float] = None
    historical_utilization_pct: Optional[float] = None
    historical_planning_method: Optional[str] = None
    conflict_change: Optional[float] = None
    utilization_change_pct_points: Optional[float] = None

class PriorityPredictionRequest(BaseModel):
    location_km: float = 12.5
    criticality_1_5: int = 4
    safety_risk_1_5: int = 4
    operational_impact_1_5: int = 4
    overdue_days: int = 15
    estimated_duration_min: int = 180
    required_team_size: int = 6
    department: str = "Engineering"
    asset_type: str = "Track"
    corridor_id: str = "C00001"
    possession_required: str = "Yes"
    maintenance_type: str = "Preventive"
    severity: str = "High"

class PriorityPredictionResponse(BaseModel):
    predicted_priority: float
    priority_category: str
    method: str
