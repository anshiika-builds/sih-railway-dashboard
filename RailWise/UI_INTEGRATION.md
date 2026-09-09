# RailWise UI Integration

The AI/optimization backend is already completed.

The main output for the UI is:

outputs/railwise_final_recommendations.csv

Other useful outputs:

outputs/asset_risk_predictions.csv
outputs/candidate_blocks.csv
outputs/conflict_analysis.csv
outputs/optimized_blocks.csv
outputs/baseline_comparison.csv

The UI should NOT recreate the AI/optimization logic.

Use these outputs to display:
- Maintenance priority
- Asset risk
- Recommended block
- Block status
- Train conflicts
- Conflict duration
- Deferred tasks
- No feasible block
- Baseline vs optimized results

The XGBoost model is available in:

models/xgboost_maintenance_priority_model.pkl