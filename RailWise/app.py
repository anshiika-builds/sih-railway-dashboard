# ============================================================
# RAILWISE — AI RAILWAY OPERATIONS CONTROL DASHBOARD
# ============================================================

import os
from pathlib import Path

import numpy as np
import pandas as pd
import streamlit as st
import plotly.express as px
import shap
import joblib
import matplotlib.pyplot as plt


# ============================================================
# CONFIGURATION
# ============================================================

st.set_page_config(
    page_title="RailWise | Railway Operations AI",
    page_icon="🚆",
    layout="wide",
    initial_sidebar_state="expanded"
)

BASE_DIR = Path(
    r"C:\Users\diksh\OneDrive\Desktop\RailWise"
)

DATA_DIR = BASE_DIR / "SIH_26027_Final_Dataset"
OUTPUT_DIR = BASE_DIR / "outputs"
MODEL_DIR = BASE_DIR / "models"

MODEL_PATH = MODEL_DIR / "xgboost_maintenance_priority_model.pkl"
FEATURE_PATH = MODEL_DIR / "model_features.pkl"

# Final backend outputs
TASK_PATH = OUTPUT_DIR / "asset_risk_predictions.csv"
FINAL_PATH = OUTPUT_DIR / "railwise_final_recommendations.csv"
OPTIMIZED_PATH = OUTPUT_DIR / "optimized_blocks.csv"
BASELINE_PATH = OUTPUT_DIR / "baseline_comparison.csv"
CANDIDATE_PATH = OUTPUT_DIR / "candidate_blocks.csv"
CONFLICT_PATH = OUTPUT_DIR / "conflict_analysis.csv"

# Raw railway data used for additional task information
MAINTENANCE_PATH = DATA_DIR / "unified_maintenance.csv"
CORRIDOR_PATH = DATA_DIR / "corridors.csv"


# ============================================================
# CUSTOM CSS
# ============================================================

st.markdown(
    """
    <style>

    .main {
        background-color: #f5f6f8;
    }

    .block-container {
        padding-top: 1.5rem;
        padding-bottom: 2rem;
    }

    .rail-title {
        font-size: 30px;
        font-weight: 750;
        letter-spacing: -0.5px;
        margin-bottom: 0px;
    }

    .rail-subtitle {
        color: #667085;
        font-size: 14px;
        margin-top: 3px;
        margin-bottom: 25px;
    }

    .section-title {
        font-size: 20px;
        font-weight: 650;
        margin-top: 15px;
        margin-bottom: 12px;
    }

    .metric-card {
        background: white;
        border: 1px solid #e4e7ec;
        border-radius: 8px;
        padding: 18px;
        min-height: 105px;
    }

    .metric-label {
        font-size: 13px;
        color: #667085;
    }

    .metric-value {
        font-size: 28px;
        font-weight: 700;
        margin-top: 5px;
        color: #2F80ED;
    }

    .metric-value.maintenance {
        color: #2F80ED;
    }

    .metric-value.critical {
        color: #EB5757;          /* Critical Tasks - Red */
    }

    .metric-value.optimized {
        color: #27AE60;          /* Optimized Blocks - Green */
    }

    .metric-value.deferred {
        color: #F2994A;          /* Deferred Requests - Orange */
    }

    .critical {
        color: #b42318;
    }

    .high {
        color: #b54708;
    }

    .medium {
        color: #a15c00;
    }

    .low {
        color: #027a48;
    }

    .status-box {
        background: white;
        border: 1px solid #e4e7ec;
        border-radius: 8px;
        padding: 15px;
        margin-bottom: 10px;
    }

    </style>
    """,
    unsafe_allow_html=True
)


# ============================================================
# DATA LOADING
# ============================================================

@st.cache_data
def load_csv(path):

    if not path.exists():
        return pd.DataFrame()

    return pd.read_csv(path)


@st.cache_data
def load_all_data():

    tasks = load_csv(TASK_PATH)
    final_recommendations = load_csv(FINAL_PATH)
    optimized_blocks = load_csv(OPTIMIZED_PATH)
    baseline = load_csv(BASELINE_PATH)
    candidates = load_csv(CANDIDATE_PATH)
    conflicts = load_csv(CONFLICT_PATH)
    maintenance = load_csv(MAINTENANCE_PATH)
    corridors = load_csv(CORRIDOR_PATH)

    # --------------------------------------------------------
    # Date conversion
    # --------------------------------------------------------

    date_columns = [
        "recommended_date",
        "requested_date",
        "planned_date",
        "block_date",
        "movement_date"
    ]

    dataframes = [
        tasks,
        final_recommendations,
        optimized_blocks,
        baseline,
        candidates,
        conflicts,
        maintenance
    ]

    for df in dataframes:

        if df.empty:
            continue

        for col in date_columns:

            if col in df.columns:

                df[col] = pd.to_datetime(
                    df[col],
                    errors="coerce"
                )

    return (
        tasks,
        final_recommendations,
        optimized_blocks,
        baseline,
        candidates,
        conflicts,
        maintenance,
        corridors
    )


@st.cache_resource
def load_model():

    model = joblib.load(MODEL_PATH)
    features = joblib.load(FEATURE_PATH)

    return model, features


(
    tasks,
    recommendations,
    optimized_blocks,
    baseline,
    candidates,
    conflicts,
    maintenance,
    corridors
) = load_all_data()


# ============================================================
# MODEL
# ============================================================

try:

    xgb_model, model_features = load_model()
    model_loaded = True

except Exception:

    xgb_model = None
    model_features = None
    model_loaded = False


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def priority_category(score):

    if pd.isna(score):
        return "Unknown"

    if score >= 80:
        return "Critical"

    elif score >= 60:
        return "High"

    elif score >= 40:
        return "Medium"

    else:
        return "Low"


def safe_col(df, column, default=None):

    if column in df.columns:
        return df[column]

    return pd.Series(
        default,
        index=df.index
    )


# ============================================================
# PREPARE SINGLE TASK FOR XGBOOST + SHAP
# ============================================================

def prepare_single_task(row):

    feature_columns = [
        "department",
        "asset_type",
        "corridor_id",
        "location_km",
        "criticality_1_5",
        "safety_risk_1_5",
        "operational_impact_1_5",
        "overdue_days",
        "estimated_duration_min",
        "required_team_size",
        "possession_required",
        "maintenance_type",
        "severity"
    ]

    categorical_columns = [
        "department",
        "asset_type",
        "corridor_id",
        "possession_required",
        "maintenance_type",
        "severity"
    ]

    # --------------------------------------------------------
    # Create one-row dataframe
    # --------------------------------------------------------

    data = pd.DataFrame([row])

    # Make sure every expected column exists
    for col in feature_columns:

        if col not in data.columns:
            data[col] = np.nan

    data = data[feature_columns].copy()

    # --------------------------------------------------------
    # Clean categorical values BEFORE encoding
    # --------------------------------------------------------

    for col in categorical_columns:

        data[col] = (
            data[col]
            .astype(str)
            .replace(
                {
                    "nan": "Unknown",
                    "None": "Unknown",
                    "NaT": "Unknown"
                }
            )
        )

    # --------------------------------------------------------
    # Clean numeric values
    # --------------------------------------------------------

    numeric_columns = [
        col for col in feature_columns
        if col not in categorical_columns
    ]

    for col in numeric_columns:

        data[col] = pd.to_numeric(
            data[col],
            errors="coerce"
        )

        if col in maintenance.columns:

            median_value = pd.to_numeric(
                maintenance[col],
                errors="coerce"
            ).median()

        else:

            median_value = 0

        data[col] = data[col].fillna(
            median_value
        )

    # --------------------------------------------------------
    # One-hot encode categorical variables
    # --------------------------------------------------------

    data = pd.get_dummies(
        data,
        columns=categorical_columns,
        drop_first=True,
        dtype=float
    )

    # --------------------------------------------------------
    # Match EXACT training feature structure
    # --------------------------------------------------------

    data = data.reindex(
        columns=model_features,
        fill_value=0
    )

    # --------------------------------------------------------
    # FORCE EVERYTHING TO NUMERIC
    # --------------------------------------------------------

    data = data.apply(
        pd.to_numeric,
        errors="coerce"
    )

    data = data.fillna(0)

    # Final safety check
    if not all(
        np.issubdtype(
            dtype,
            np.number
        )
        for dtype in data.dtypes
    ):
        raise ValueError(
            "SHAP input contains non-numeric columns."
        )

    return data



def format_date(value):

    if pd.isna(value):
        return "—"

    try:
        return pd.to_datetime(value).strftime(
            "%d %b %Y"
        )
    except Exception:
        return str(value)


def format_time(value):

    if pd.isna(value):
        return "—"

    return str(value)


# ============================================================
# HEADER
# ============================================================

st.markdown(
    '<div class="rail-title">🚆 RAILWISE</div>',
    unsafe_allow_html=True
)

st.markdown(
    '<div class="rail-subtitle">'
    'AI-assisted railway maintenance prioritization and '
    'automatic block planning'
    '</div>',
    unsafe_allow_html=True
)


# ============================================================
# SIDEBAR
# ============================================================

st.sidebar.markdown("## Operations Control")

page = st.sidebar.radio(
    "Navigate",
    [
        "Operations Overview",
        "AI Task Prioritization",
        "AI Block Planner",
        "Explainable AI"
    ]
)

st.sidebar.markdown("---")

st.sidebar.caption(
    "Decision-support prototype"
)

st.sidebar.caption(
    "XGBoost + SHAP + OR-Tools"
)

st.sidebar.markdown("---")

st.sidebar.caption(
    "Dataset: Synthetic prototype data"
)


# ============================================================
# PAGE 1 — OPERATIONS OVERVIEW
# ============================================================

if page == "Operations Overview":

    st.markdown(
        '<div class="section-title">'
        'Network Operations Overview'
        '</div>',
        unsafe_allow_html=True
    )

    # --------------------------------------------------------
    # Metrics
    # --------------------------------------------------------

    total_tasks = (
        len(tasks)
        if not tasks.empty
        else len(maintenance)
    )

    total_requests = len(
        recommendations
    )

    optimized_count = 0
    deferred_count = 0
    no_feasible_count = 0

    if not recommendations.empty:

        status_counts = (
            recommendations[
                "request_status"
            ]
            .value_counts()
        )

        optimized_count = int(
            status_counts.get(
                "OPTIMIZED",
                0
            )
        )

        deferred_count = int(
            status_counts.get(
                "DEFERRED",
                0
            )
        )

        no_feasible_count = int(
            status_counts.get(
                "NO FEASIBLE BLOCK",
                0
            )
        )

    critical_tasks = 0
    high_tasks = 0

    if not tasks.empty:

        if "priority_category" in tasks.columns:

            critical_tasks = int(
                (
                    tasks[
                        "priority_category"
                    ] == "Critical"
                ).sum()
            )

            high_tasks = int(
                (
                    tasks[
                        "priority_category"
                    ] == "High"
                ).sum()
            )

    c1, c2, c3, c4 = st.columns(4)

    with c1:
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-label">Maintenance Tasks</div>
                <div class="metric-value">
                    {total_tasks:,}
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with c2:
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-label">Critical Tasks</div>
                <div class="metric-value critical">
                    {critical_tasks:,}
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with c3:
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-label">Optimized Blocks</div>
                <div class="metric-value optimized">
                    {optimized_count:,}
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )

    with c4:
        st.markdown(
            f"""
            <div class="metric-card">
                <div class="metric-label">Deferred Requests</div>
                <div class="metric-value deferred">
                    {deferred_count:,}
                </div>
            </div>
            """,
            unsafe_allow_html=True
        )

    st.markdown("")

    # --------------------------------------------------------
    # Request Status
    # --------------------------------------------------------

    col1, col2 = st.columns(2)

    with col1:

        st.markdown(
            '<div class="section-title">'
            'Block Request Status'
            '</div>',
            unsafe_allow_html=True
        )

        if not recommendations.empty:

            status_df = (
                recommendations[
                    "request_status"
                ]
                .value_counts()
                .reset_index()
            )

            status_df.columns = [
                "Status",
                "Requests"
            ]

            fig = px.bar(
                status_df,
                x="Status",
                y="Requests",
                text="Requests"
            )

            fig.update_layout(
                height=350,
                margin=dict(
                    l=20,
                    r=20,
                    t=20,
                    b=20
                ),
                plot_bgcolor="white",
                paper_bgcolor="white"
            )

            st.plotly_chart(
                fig,
                use_container_width=True
            )

    with col2:

        st.markdown(
            '<div class="section-title">'
            'Maintenance Priority Distribution'
            '</div>',
            unsafe_allow_html=True
        )

        if not tasks.empty and \
           "priority_category" in tasks.columns:

            priority_counts = (
                tasks[
                    "priority_category"
                ]
                .value_counts()
                .reindex(
                    [
                        "Critical",
                        "High",
                        "Medium",
                        "Low"
                    ],
                    fill_value=0
                )
                .reset_index()
            )

            priority_counts.columns = [
                "Priority",
                "Tasks"
            ]

            fig = px.bar(
                priority_counts,
                x="Priority",
                y="Tasks",
                text="Tasks"
            )

            fig.update_layout(
                height=350,
                margin=dict(
                    l=20,
                    r=20,
                    t=20,
                    b=20
                ),
                plot_bgcolor="white",
                paper_bgcolor="white"
            )

            st.plotly_chart(
                fig,
                use_container_width=True
            )

    # --------------------------------------------------------
    # Optimization Summary
    # --------------------------------------------------------

    st.markdown(
        '<div class="section-title">'
        'Optimization Summary'
        '</div>',
        unsafe_allow_html=True
    )

    summary_data = pd.DataFrame({
        "Metric": [
            "Total Block Requests",
            "Optimized",
            "Deferred",
            "No Feasible Block",
            "Optimization Coverage"
        ],
        "Value": [
            total_requests,
            optimized_count,
            deferred_count,
            no_feasible_count,
            (
                f"{optimized_count / total_requests * 100:.1f}%"
                if total_requests > 0
                else "0%"
            )
        ]
    })

    st.dataframe(
        summary_data,
        use_container_width=True,
        hide_index=True
    )

    # --------------------------------------------------------
    # Highest Priority Tasks
    # --------------------------------------------------------

    st.markdown(
        '<div class="section-title">'
        'Highest Priority Maintenance Tasks'
        '</div>',
        unsafe_allow_html=True
    )

    if not tasks.empty:

        display_columns = [
            col for col in [
                "task_id",
                "asset_id",
                "asset_type",
                "corridor_id",
                "severity",
                "safety_risk_1_5",
                "overdue_days",
                "predicted_priority",
                "priority_category"
            ]
            if col in tasks.columns
        ]

        st.dataframe(
            tasks.sort_values(
                "predicted_priority",
                ascending=False
            )[display_columns].head(15),
            use_container_width=True,
            hide_index=True
        )


# ============================================================
# PAGE 2 — AI TASK PRIORITIZATION
# ============================================================

elif page == "AI Task Prioritization":

    st.markdown(
        '<div class="section-title">'
        'AI Maintenance Priority Queue'
        '</div>',
        unsafe_allow_html=True
    )

    if tasks.empty:

        st.error(
            "asset_risk_predictions.csv could not be loaded."
        )

    else:

        col1, col2, col3 = st.columns(3)

        # ----------------------------------------------------
        # Corridor
        # ----------------------------------------------------

        with col1:

            corridors_list = [
                "All"
            ] + sorted(
                tasks[
                    "corridor_id"
                ]
                .dropna()
                .astype(str)
                .unique()
                .tolist()
            )

            selected_corridor = st.selectbox(
                "Corridor",
                corridors_list
            )

        # ----------------------------------------------------
        # Department
        # ----------------------------------------------------

        with col2:

            departments = [
                "All"
            ] + sorted(
                tasks[
                    "department"
                ]
                .dropna()
                .astype(str)
                .unique()
                .tolist()
            )

            selected_department = st.selectbox(
                "Department",
                departments
            )

        # ----------------------------------------------------
        # Priority
        # ----------------------------------------------------

        with col3:

            priority_filter = st.selectbox(
                "Priority",
                [
                    "All",
                    "Critical",
                    "High",
                    "Medium",
                    "Low"
                ]
            )

        filtered = tasks.copy()

        if selected_corridor != "All":

            filtered = filtered[
                filtered[
                    "corridor_id"
                ].astype(str)
                == selected_corridor
            ]

        if selected_department != "All":

            filtered = filtered[
                filtered[
                    "department"
                ].astype(str)
                == selected_department
            ]

        if priority_filter != "All":

            filtered = filtered[
                filtered[
                    "priority_category"
                ] == priority_filter
            ]

        filtered = filtered.sort_values(
            "predicted_priority",
            ascending=False
        )

        st.caption(
            f"{len(filtered):,} tasks match the current filters"
        )

        display_columns = [
            col for col in [
                "task_id",
                "asset_id",
                "asset_type",
                "department",
                "corridor_id",
                "severity",
                "overdue_days",
                "safety_risk_1_5",
                "operational_impact_1_5",
                "predicted_priority",
                "priority_category"
            ]
            if col in filtered.columns
        ]

        st.dataframe(
            filtered[
                display_columns
            ],
            use_container_width=True,
            hide_index=True,
            height=550
        )


# ============================================================
# PAGE 3 — AI BLOCK PLANNER
# ============================================================

elif page == "AI Block Planner":

    st.markdown(
        '<div class="section-title">'
        'AI Block Planning Recommendations'
        '</div>',
        unsafe_allow_html=True
    )

    if recommendations.empty:

        st.error(
            "railwise_final_recommendations.csv "
            "could not be loaded."
        )

    else:

        # ----------------------------------------------------
        # Status filter
        # ----------------------------------------------------

        col1, col2, col3 = st.columns(3)

        with col1:

            status_options = [
                "All"
            ] + sorted(
                recommendations[
                    "request_status"
                ]
                .dropna()
                .unique()
                .tolist()
            )

            selected_status = st.selectbox(
                "Request Status",
                status_options
            )

        with col2:

            corridor_options = [
                "All"
            ] + sorted(
                recommendations[
                    "corridor_id"
                ]
                .dropna()
                .astype(str)
                .unique()
                .tolist()
            )

            selected_corridor = st.selectbox(
                "Corridor",
                corridor_options
            )

        with col3:

            priority_options = [
                "All",
                "Critical",
                "High",
                "Medium",
                "Low"
            ]

            selected_priority = st.selectbox(
                "Priority",
                priority_options
            )

        planner = recommendations.copy()

        # ----------------------------------------------------
        # Apply filters
        # ----------------------------------------------------

        if selected_status != "All":

            planner = planner[
                planner[
                    "request_status"
                ] == selected_status
            ]

        if selected_corridor != "All":

            planner = planner[
                planner[
                    "corridor_id"
                ].astype(str)
                == selected_corridor
            ]

        if selected_priority != "All":

            planner = planner[
                planner[
                    "priority_category"
                ] == selected_priority
            ]

        st.caption(
            f"{len(planner):,} block requests shown"
        )

        # ----------------------------------------------------
        # Planner metrics
        # ----------------------------------------------------

        optimized_view = recommendations[
            recommendations[
                "request_status"
            ] == "OPTIMIZED"
        ]

        total_conflicts = 0
        conflict_duration = 0

        if not optimized_view.empty:

            if "train_conflict_count" in optimized_view.columns:

                total_conflicts = int(
                    pd.to_numeric(
                        optimized_view[
                            "train_conflict_count"
                        ],
                        errors="coerce"
                    )
                    .fillna(0)
                    .sum()
                )

            if "conflict_duration_min" in optimized_view.columns:

                conflict_duration = int(
                    pd.to_numeric(
                        optimized_view[
                            "conflict_duration_min"
                        ],
                        errors="coerce"
                    )
                    .fillna(0)
                    .sum()
                )

        c1, c2, c3, c4 = st.columns(4)

        with c1:
            st.metric(
                "Optimized Blocks",
                f"{len(optimized_view):,}"
            )

        with c2:
            st.metric(
                "Train Conflicts",
                f"{total_conflicts:,}"
            )

        with c3:
            st.metric(
                "Conflict Duration",
                f"{conflict_duration:,} min"
            )

        with c4:

            coverage = (
                len(optimized_view)
                / len(recommendations)
                * 100
            )

            st.metric(
                "Request Coverage",
                f"{coverage:.1f}%"
            )

        # ----------------------------------------------------
        # Main recommendation table
        # ----------------------------------------------------

        st.markdown(
            '<div class="section-title">'
            'Block Recommendations'
            '</div>',
            unsafe_allow_html=True
        )

        display_columns = [
            col for col in [
                "block_request_id",
                "task_id",
                "asset_id",
                "corridor_id",
                "predicted_priority",
                "priority_category",
                "requested_duration_min",
                "recommended_date",
                "recommended_start",
                "recommended_end",
                "recommended_duration_min",
                "train_conflict_count",
                "conflict_duration_min",
                "affected_trains",
                "feasibility",
                "reason_for_recommendation"
            ]
            if col in planner.columns
        ]

        st.dataframe(
            planner.sort_values(
                "predicted_priority",
                ascending=False
            )[display_columns],
            use_container_width=True,
            hide_index=True,
            height=550
        )

        # ----------------------------------------------------
        # Optimized block visualization
        # ----------------------------------------------------

        if not optimized_view.empty:

            st.markdown(
                '<div class="section-title">'
                'Optimized Block Priority'
                '</div>',
                unsafe_allow_html=True
            )

            chart_data = (
                optimized_view
                .sort_values(
                    "predicted_priority",
                    ascending=False
                )
                .head(20)
                [
                    [
                        "block_request_id",
                        "predicted_priority"
                    ]
                ]
            )

            fig = px.bar(
                chart_data,
                x="block_request_id",
                y="predicted_priority"
            )

            fig.update_layout(
                height=350,
                xaxis_title="Block Request",
                yaxis_title="AI Priority",
                plot_bgcolor="white",
                paper_bgcolor="white"
            )

            st.plotly_chart(
                fig,
                use_container_width=True
            )


# ============================================================
# PAGE 4 — EXPLAINABLE AI
# ============================================================

elif page == "Explainable AI":

    st.markdown(
        '<div class="section-title">'
        'Explainable AI — Maintenance Priority'
        '</div>',
        unsafe_allow_html=True
    )

    if tasks.empty:

        st.error(
            "Task prediction data is unavailable."
        )

    else:

        task_options = (
            tasks[
                [
                    "task_id",
                    "predicted_priority"
                ]
            ]
            .drop_duplicates("task_id")
            .sort_values(
                "predicted_priority",
                ascending=False
            )
        )

        selected_task_id = st.selectbox(
            "Select maintenance task",
            task_options[
                "task_id"
            ].tolist()
        )

        selected_rows = tasks[
            tasks[
                "task_id"
            ] == selected_task_id
        ]

        if selected_rows.empty:

            st.warning(
                "Selected task could not be found."
            )

        else:

            selected_row = (
                selected_rows.iloc[0]
            )

            score = float(
                selected_row[
                    "predicted_priority"
                ]
            )

            category = priority_category(
                score
            )

            # ------------------------------------------------
            # Metrics
            # ------------------------------------------------

            c1, c2, c3, c4 = st.columns(4)

            with c1:

                st.metric(
                    "AI Priority",
                    f"{score:.2f}"
                )

            with c2:

                st.metric(
                    "Priority Class",
                    category
                )

            with c3:

                st.metric(
                    "Safety Risk",
                    f"{selected_row['safety_risk_1_5']:.0f}/5"
                )

            with c4:

                st.metric(
                    "Overdue",
                    f"{selected_row['overdue_days']:.0f} days"
                )

            st.markdown("")

            col1, col2 = st.columns(
                [1, 1]
            )

            # ------------------------------------------------
            # Task details
            # ------------------------------------------------

            with col1:

                st.markdown(
                    '<div class="section-title">'
                    'Task Details'
                    '</div>',
                    unsafe_allow_html=True
                )

                detail_fields = [
                    ("Task ID", "task_id"),
                    ("Asset", "asset_id"),
                    ("Asset Type", "asset_type"),
                    ("Department", "department"),
                    ("Corridor", "corridor_id"),
                    ("Severity", "severity"),
                    ("Criticality", "criticality_1_5"),
                    ("Safety Risk", "safety_risk_1_5"),
                    (
                        "Operational Impact",
                        "operational_impact_1_5"
                    ),
                    ("Overdue Days", "overdue_days"),
                    (
                        "Maintenance Type",
                        "maintenance_type"
                    )
                ]

                details = []

                for label, column in detail_fields:

                    if column in selected_row.index:

                        details.append({
                            "Parameter": label,
                            "Value": selected_row[
                                column
                            ]
                        })

                details_df = pd.DataFrame(
                    details
                )

                st.dataframe(
                    details_df,
                    use_container_width=True,
                    hide_index=True
                )

            # ------------------------------------------------
            # SHAP explanation
            # ------------------------------------------------

            with col2:

                st.markdown(
                    '<div class="section-title">'
                    'Why did the AI assign this priority?'
                    '</div>',
                    unsafe_allow_html=True
                )

                if not model_loaded:

                    st.warning(
                        "XGBoost model could not be loaded."
                    )

                else:

                    
                    try:

                        # --------------------------------------------------------
                        # Prepare model input
                        # --------------------------------------------------------

                        task_input = prepare_single_task(
                            selected_row
                        )

                        # --------------------------------------------------------
                        # Verify input is numeric
                        # --------------------------------------------------------

                        if not all(
                            np.issubdtype(
                                dtype,
                                np.number
                            )
                            for dtype in task_input.dtypes
                        ):
                            raise ValueError(
                                "SHAP input contains non-numeric values."
                            )

                        # --------------------------------------------------------
                        # Create SHAP explainer
                        # --------------------------------------------------------

                        explainer = shap.TreeExplainer(
                            xgb_model
                        )

                        shap_values = explainer.shap_values(
                            task_input
                        )

                        # --------------------------------------------------------
                        # Expected value
                        # --------------------------------------------------------

                        base_value = explainer.expected_value

                        if isinstance(
                            base_value,
                            np.ndarray
                        ):
                            base_value = base_value[0]

                        # --------------------------------------------------------
                        # SHAP explanation
                        # --------------------------------------------------------

                        explanation = shap.Explanation(
                            values=shap_values[0],
                            base_values=base_value,
                            data=task_input.iloc[0],
                            feature_names=task_input.columns
                        )

                        # --------------------------------------------------------
                        # Waterfall plot
                        # --------------------------------------------------------

                        fig, ax = plt.subplots(
                            figsize=(8, 6)
                        )

                        shap.plots.waterfall(
                            explanation,
                            max_display=10,
                            show=False
                        )

                        st.pyplot(
                            fig,
                            clear_figure=True
                        )

                        plt.close(fig)

                    except Exception as e:

                        st.error(
                            f"Unable to generate SHAP explanation: {e}"
                        )


            # ------------------------------------------------
            # Human-readable interpretation
            # ------------------------------------------------

            st.markdown(
                '<div class="section-title">'
                'Operational Interpretation'
                '</div>',
                unsafe_allow_html=True
            )

            reasons = []

            safety = selected_row.get(
                "safety_risk_1_5",
                0
            )

            overdue = selected_row.get(
                "overdue_days",
                0
            )

            operational = selected_row.get(
                "operational_impact_1_5",
                0
            )

            criticality = selected_row.get(
                "criticality_1_5",
                0
            )

            if safety >= 4:

                reasons.append(
                    "High safety risk is strongly "
                    "increasing the maintenance priority."
                )

            if overdue > 30:

                reasons.append(
                    f"The task is "
                    f"{int(overdue)} days overdue."
                )

            if operational >= 4:

                reasons.append(
                    "High operational impact is "
                    "increasing the priority."
                )

            if criticality >= 4:

                reasons.append(
                    "The asset has high operational "
                    "criticality."
                )

            if not reasons:

                reasons.append(
                    "The priority is influenced by "
                    "multiple operational factors."
                )

            for reason in reasons:

                st.write(
                    "•",
                    reason
                )

            st.info(
                f"AI assessment: this task has a "
                f"predicted maintenance priority of "
                f"{score:.2f} and is classified as "
                f"{category}."
            )


# ============================================================
# FOOTER
# ============================================================

st.sidebar.markdown("---")

st.sidebar.caption(
    "RailWise • AI-powered maintenance and block planning"
)

st.sidebar.caption(
    "Synthetic prototype dataset"
)