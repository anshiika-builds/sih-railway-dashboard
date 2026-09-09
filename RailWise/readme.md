# 🚆 RailWise
## AI-Powered Automatic Block Planning for Railway Maintenance

RailWise is an AI-assisted decision-support system designed to prioritize railway maintenance tasks and recommend feasible maintenance blocks while minimizing disruption to train operations.

> **Dataset Note:** The provided dataset is a synthetic prototype dataset created for project demonstration and does not represent actual Indian Railways operational data.

---

## 🎯 Problem Statement

Railway maintenance requires temporary track/block possessions that can interfere with scheduled train movements.

Manual block planning can become difficult when multiple maintenance requests, train movements, available block windows, maintenance priorities and operational constraints need to be considered simultaneously.

RailWise addresses this problem using:

- Machine Learning for maintenance priority prediction
- Explainable AI using SHAP
- Conflict detection between maintenance blocks and train movements
- Constraint optimization using Google OR-Tools
- An interactive Streamlit dashboard

---

## 🧠 System Architecture

```text
Railway Dataset
       ↓
Data Preprocessing
       ↓
XGBoost Maintenance Priority Model
       ↓
Risk / Priority Assessment
       ↓
Candidate Block Generation
       ↓
Train Conflict Detection
       ↓
OR-Tools Constraint Optimization
       ↓
Optimized Maintenance Blocks
       ↓
Streamlit Decision-Support Dashboard