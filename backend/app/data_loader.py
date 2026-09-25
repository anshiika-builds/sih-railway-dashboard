import os
import pickle
import pandas as pd
import numpy as np

class DataLoader:
    def __init__(self):
        self.base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
        self.railwise_dir = os.path.join(self.base_dir, 'RailWise')
        self.outputs_dir = os.path.join(self.railwise_dir, 'outputs')
        self.dataset_dir = os.path.join(self.railwise_dir, 'SIH_26027_Final_Dataset')
        self.models_dir = os.path.join(self.railwise_dir, 'models')

        # DataFrames
        self.final_recommendations_df = pd.DataFrame()
        self.asset_risk_df = pd.DataFrame()
        self.candidate_blocks_df = pd.DataFrame()
        self.conflict_analysis_df = pd.DataFrame()
        self.optimized_blocks_df = pd.DataFrame()
        self.baseline_comparison_df = pd.DataFrame()
        self.block_summary_df = pd.DataFrame()
        self.block_recommendations_df = pd.DataFrame()
        self.task_predictions_df = pd.DataFrame()

        # Raw datasets
        self.corridors_df = pd.DataFrame()
        self.train_schedule_df = pd.DataFrame()
        self.asset_master_df = pd.DataFrame()
        self.unified_maintenance_df = pd.DataFrame()
        self.block_requests_df = pd.DataFrame()
        self.coa_availability_df = pd.DataFrame()
        self.goods_forecast_df = pd.DataFrame()
        self.historical_plans_df = pd.DataFrame()
        self.movement_windows_df = pd.DataFrame()

        # ML Model
        self.model = None
        self.model_features = None
        self.is_loaded = False

    def load_all_data(self):
        """Loads all CSV outputs and datasets into pandas DataFrames."""
        print("Initializing RailWise Backend Data Loader...")

        def _read_csv_safe(path):
            if os.path.exists(path):
                try:
                    df = pd.read_csv(path)
                    # Convert NaN values to None for clean JSON serialization
                    return df.replace({np.nan: None})
                except Exception as e:
                    print(f"Warning: Failed to parse {path}: {e}")
            return pd.DataFrame()

        # 1. Load Primary Outputs
        self.final_recommendations_df = _read_csv_safe(os.path.join(self.outputs_dir, 'railwise_final_recommendations.csv'))
        self.asset_risk_df = _read_csv_safe(os.path.join(self.outputs_dir, 'asset_risk_predictions.csv'))
        self.candidate_blocks_df = _read_csv_safe(os.path.join(self.outputs_dir, 'candidate_blocks.csv'))
        self.conflict_analysis_df = _read_csv_safe(os.path.join(self.outputs_dir, 'conflict_analysis.csv'))
        self.optimized_blocks_df = _read_csv_safe(os.path.join(self.outputs_dir, 'optimized_blocks.csv'))
        self.baseline_comparison_df = _read_csv_safe(os.path.join(self.outputs_dir, 'baseline_comparison.csv'))
        self.block_summary_df = _read_csv_safe(os.path.join(self.outputs_dir, 'block_summary.csv'))
        self.block_recommendations_df = _read_csv_safe(os.path.join(self.outputs_dir, 'block_recommendations.csv'))
        self.task_predictions_df = _read_csv_safe(os.path.join(self.outputs_dir, 'task_predictions.csv'))

        # 2. Load Raw Datasets
        self.corridors_df = _read_csv_safe(os.path.join(self.dataset_dir, 'corridors.csv'))
        self.train_schedule_df = _read_csv_safe(os.path.join(self.dataset_dir, 'train_schedule.csv'))
        self.asset_master_df = _read_csv_safe(os.path.join(self.dataset_dir, 'asset_master.csv'))
        self.unified_maintenance_df = _read_csv_safe(os.path.join(self.dataset_dir, 'unified_maintenance.csv'))
        self.block_requests_df = _read_csv_safe(os.path.join(self.dataset_dir, 'block_requests.csv'))
        self.coa_availability_df = _read_csv_safe(os.path.join(self.dataset_dir, 'coa_block_availability.csv'))
        self.goods_forecast_df = _read_csv_safe(os.path.join(self.dataset_dir, 'goods_train_forecast.csv'))
        self.historical_plans_df = _read_csv_safe(os.path.join(self.dataset_dir, 'historical_block_plans.csv'))
        self.movement_windows_df = _read_csv_safe(os.path.join(self.dataset_dir, 'train_movement_windows.csv'))

        # 3. Load XGBoost Model if present and XGBoost module is available
        model_path = os.path.join(self.models_dir, 'xgboost_maintenance_priority_model.pkl')
        features_path = os.path.join(self.models_dir, 'model_features.pkl')

        if os.path.exists(features_path):
            try:
                with open(features_path, 'rb') as f:
                    self.model_features = pickle.load(f)
            except Exception as e:
                print(f"Warning: Could not load model features: {e}")

        if os.path.exists(model_path):
            try:
                import xgboost
                with open(model_path, 'rb') as f:
                    self.model = pickle.load(f)
                print("Successfully loaded XGBoost model into memory!")
            except Exception as e:
                print(f"Notice: XGBoost model available on disk, using pre-calculated predictions engine ({e})")

        self.is_loaded = True
        print(f"Data Loader Complete: Loaded {len(self.final_recommendations_df)} final recommendations, {len(self.conflict_analysis_df)} conflicts, {len(self.corridors_df)} corridors.")

# Global Singleton Instance
db = DataLoader()
