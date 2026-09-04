import os
import csv
import random
from datetime import datetime, timedelta

os.makedirs('public/data', exist_ok=True)
random.seed(42)

# Helper functions
def random_date(start_days_ago=30, end_days_ahead=30):
    base = datetime(2026, 9, 4)
    days = random.randint(-start_days_ago, end_days_ahead)
    return (base + timedelta(days=days)).strftime('%Y-%m-%d')

def random_time():
    h = random.randint(0, 23)
    m = random.choice([0, 15, 30, 45])
    return f"{h:02d}:{m:02d}"

print("Generating corridors.csv...")
zones = ['Northern Railway', 'Eastern Railway', 'Western Railway', 'Central Railway', 'Southern Railway', 'South Central Railway', 'South Eastern Railway', 'East Coast Railway']
divisions = ['Delhi', 'Howrah', 'Mumbai', 'Chennai', 'Secunderabad', 'Bengaluru', 'Nagpur', 'Prayagraj', 'Lucknow', 'Ambala']
station_pairs = [
    ('NDLS', 'New Delhi', 'CNB', 'Kanpur Central', 'Northern Railway', 'Delhi'),
    ('HWH', 'Howrah', 'KGP', 'Kharagpur', 'Eastern Railway', 'Howrah'),
    ('CSMT', 'Mumbai CSMT', 'PUNE', 'Pune Jn', 'Central Railway', 'Mumbai'),
    ('MAS', 'Chennai Central', 'BZA', 'Vijayawada', 'Southern Railway', 'Chennai'),
    ('SBC', 'Bengaluru City', 'MYS', 'Mysuru Jn', 'South Western Railway', 'Bengaluru'),
    ('SC', 'Secunderabad', 'KZJ', 'Kazipet Jn', 'South Central Railway', 'Secunderabad'),
    ('PRYJ', 'Prayagraj Jn', 'DDU', 'Pt. DD Upadhyaya Jn', 'North Central Railway', 'Prayagraj'),
    ('LKO', 'Lucknow Charbagh', 'BE', 'Bareilly Jn', 'Northern Railway', 'Lucknow'),
    ('ADI', 'Ahmedabad Jn', 'BRC', 'Vadodara Jn', 'Western Railway', 'Vadodara'),
    ('NGP', 'Nagpur Jn', 'BPQ', 'Balharshah', 'Central Railway', 'Nagpur')
]

corridors = []
for i in range(1, 101):
    c_id = f"COR-{i:03d}"
    sp = station_pairs[(i - 1) % len(station_pairs)]
    c_name = f"{sp[1]} - {sp[3]} Main Section ({i})"
    corridors.append({
        'corridor_id': c_id,
        'corridor_name': c_name,
        'zone': sp[4],
        'division': sp[5],
        'start_station_code': sp[0],
        'start_station_name': sp[1],
        'end_station_code': sp[2],
        'end_station_name': sp[3],
        'distance_km': round(random.uniform(80, 450), 1),
        'track_type': random.choice(['Double Line', 'Multiple Lines (3+)', 'Single Line High Density']),
        'electrified': random.choice(['Yes', 'Yes', 'Yes', 'No']),
        'traffic_density': random.choice(['High', 'Very High', 'Medium', 'Extreme']),
        'corridor_criticality': random.choice(['Critical', 'High', 'Medium', 'Low']),
        'maximum_speed_kmph': random.choice([110, 130, 160]),
        'operational_status': random.choice(['Operational', 'Heavy Traffic', 'Maintenance Block Active', 'Speed Restriction'])
    })

with open('public/data/corridors.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=list(corridors[0].keys()))
    writer.writeheader()
    writer.writerows(corridors)

print("Generating asset_master.csv (12,000 rows)...")
asset_types = ['Point & Crossing', 'Signal - Multi Aspect', 'Track Circuit', 'OHE Catenary', 'Interlocking Switch', 'Axle Counter', 'Bridge Span', 'Level Crossing Gate']
departments = ['Engineering', 'Signal & Telecom', 'Electrical', 'Operating']
assets = []
for i in range(1, 12001):
    a_id = f"AST-{i:05d}"
    inst_year = random.randint(1995, 2024)
    age = 2026 - inst_year
    next_due_days = random.randint(-15, 60)
    next_due = (datetime(2026, 9, 4) + timedelta(days=next_due_days)).strftime('%Y-%m-%d')
    last_maint = (datetime(2026, 9, 4) - timedelta(days=random.randint(20, 180))).strftime('%Y-%m-%d')
    assets.append({
        'asset_id': a_id,
        'asset_type': random.choice(asset_types),
        'department': random.choice(departments),
        'corridor_id': f"COR-{random.randint(1, 100):03d}",
        'location_km': round(random.uniform(2.0, 420.0), 1),
        'installation_year': inst_year,
        'asset_age_years': age,
        'condition_score_1_5': round(random.uniform(1.2, 4.9), 1),
        'criticality_1_5': random.randint(1, 5),
        'last_maintenance_date': last_maint,
        'next_due_date': next_due,
        'failure_history_count': random.randint(0, 12),
        'availability_pct': round(random.uniform(85.0, 99.9), 1),
        'operational_dependency': random.choice(['Critical', 'High', 'Medium', 'Low']),
        'active_status': random.choice(['Active', 'Active', 'Active', 'Under Inspection', 'Maintenance Due'])
    })

with open('public/data/asset_master.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=list(assets[0].keys()))
    writer.writeheader()
    writer.writerows(assets)

print("Generating unified_maintenance.csv (14,400 rows)...")
defects = [
    'Rail flaw ultrasonics check required',
    'Point machine lubrication & locking calibration',
    'OHE cantilever insulator cleaning & height adjustment',
    'Axle counter digital sensor reset test',
    'Track tamping, ballast packing & alignment check',
    'Multi-aspect LED signal bulb replacement & relay test',
    'Level crossing gate motor overhaul & interlock test',
    'Bridge expansion joint inspection & bolt tightening'
]

maintenance_tasks = []
for i in range(1, 14401):
    t_id = f"TSK-{i:05d}"
    ast = assets[(i - 1) % len(assets)]
    urgency = round(random.uniform(20.0, 98.5), 1)
    risk = round(random.uniform(15.0, 96.0), 1)
    prio_score = round(0.5 * urgency + 0.5 * risk, 1)
    maintenance_tasks.append({
        'task_id': t_id,
        'department': ast['department'],
        'asset_id': ast['asset_id'],
        'asset_type': ast['asset_type'],
        'corridor_id': ast['corridor_id'],
        'location_km': ast['location_km'],
        'defect_or_task': random.choice(defects),
        'severity': random.choice(['Critical', 'Major', 'Moderate', 'Minor']),
        'criticality_1_5': ast['criticality_1_5'],
        'safety_risk_1_5': random.randint(1, 5),
        'operational_impact_1_5': random.randint(1, 5),
        'overdue_days': random.randint(0, 45),
        'estimated_duration_min': random.choice([60, 120, 180, 240, 360]),
        'required_team_size': random.randint(3, 12),
        'possession_required': random.choice(['Yes', 'Yes', 'No']),
        'maintenance_type': random.choice(['Preventive', 'Corrective', 'Breakdown', 'Emergency']),
        'status': random.choice(['Pending', 'Scheduled', 'In Progress', 'Completed']),
        'urgency_score': urgency,
        'risk_score': risk,
        'asset_downtime_risk': random.choice(['High', 'Medium', 'Low']),
        'maintenance_priority_score': prio_score
    })

with open('public/data/unified_maintenance.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=list(maintenance_tasks[0].keys()))
    writer.writeheader()
    writer.writerows(maintenance_tasks)

print("Generating train_schedule.csv (26,736 rows)...")
train_names = [
    (12301, 'Howrah Rajdhani Express', 'Rajdhani'),
    (12951, 'Mumbai Rajdhani Express', 'Rajdhani'),
    (22436, 'Vande Bharat Express', 'Vande Bharat'),
    (12002, 'Bhopal Shatabdi Express', 'Shatabdi'),
    (12626, 'Kerala Superfast Express', 'Superfast'),
    (12860, 'Gitanjali Express', 'Express'),
    (54321, 'Container Goods Rake Fast', 'Goods / Freight'),
    (58901, 'Coal Rake Super Heavy', 'Goods / Freight'),
    (63201, 'MEMU Passenger Local', 'MEMU / Passenger')
]

schedules = []
row_count = 0
for i in range(1, 2971):
    tn = train_names[(i - 1) % len(train_names)]
    cor = corridors[(i - 1) % len(corridors)]
    for seq in range(1, 10): # 9 stations per schedule
        row_count += 1
        arr = random_time()
        dep = random_time()
        schedules.append({
            'schedule_id': f"SCH-{row_count:05d}",
            'train_no': tn[0],
            'train_name': tn[1],
            'train_type': tn[2],
            'source_station_code': cor['start_station_code'],
            'source_station_name': cor['start_station_name'],
            'destination_station_code': cor['end_station_code'],
            'destination_station_name': cor['end_station_name'],
            'station_sequence': seq,
            'station_code': f"{cor['start_station_code'][:2]}ST{seq}",
            'station_name': f"Intermediate Stn {seq} ({cor['start_station_code']})",
            'arrival_time': arr,
            'departure_time': dep,
            'distance_km': round(seq * (cor['distance_km'] / 9), 1),
            'running_days': random.choice(['Daily', 'Mon, Wed, Fri', 'Tue, Thu, Sat', 'Sun']),
            'direction': random.choice(['UP', 'DN'])
        })

with open('public/data/train_schedule.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=list(schedules[0].keys()))
    writer.writeheader()
    writer.writerows(schedules)

print("Generating block_requests.csv (6,000 rows)...")
block_reqs = []
for i in range(1, 6001):
    tsk = maintenance_tasks[(i - 1) % len(maintenance_tasks)]
    block_reqs.append({
        'block_request_id': f"BLK-{i:05d}",
        'task_id': tsk['task_id'],
        'corridor_id': tsk['corridor_id'],
        'department': tsk['department'],
        'requested_duration_min': random.choice([60, 120, 180, 240, 300, 360]),
        'requested_date': random_date(-5, 25),
        'priority': random.choice(['P1 - Emergency', 'P2 - High', 'P3 - Medium', 'P4 - Routine']),
        'request_status': random.choice(['Pending', 'Approved', 'Scheduled', 'Rejected', 'Conflict Flagged'])
    })

with open('public/data/block_requests.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=list(block_reqs[0].keys()))
    writer.writeheader()
    writer.writerows(block_reqs)

print("Generating coa_block_availability.csv (1,500 rows)...")
coa_avail = []
for i in range(1, 1501):
    sh = random.randint(0, 20)
    eh = min(sh + random.choice([2, 3, 4]), 23)
    duration = (eh - sh) * 60
    coa_avail.append({
        'block_window_id': f"COA-{i:05d}",
        'corridor_id': f"COR-{random.randint(1, 100):03d}",
        'block_date': random_date(-5, 25),
        'window_start': f"{sh:02d}:00",
        'window_end': f"{eh:02d}:00",
        'available_duration_min': duration,
        'availability_status': random.choice(['Available', 'Occupied by Freight', 'Blocked for Track Machine', 'Reserved']),
        'source': random.choice(['COA System Feed', 'Division Manual Entry', 'AI Predicted Margin'])
    })

with open('public/data/coa_block_availability.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=list(coa_avail[0].keys()))
    writer.writeheader()
    writer.writerows(coa_avail)

print("Generating goods_train_forecast.csv (3,000 rows)...")
goods_fcst = []
for i in range(1, 3001):
    goods_fcst.append({
        'forecast_id': f"FCST-{i:05d}",
        'corridor_id': f"COR-{random.randint(1, 100):03d}",
        'forecast_date': random_date(0, 30),
        'forecast_goods_trains': random.randint(8, 45),
        'peak_period': random.choice(['Morning (06:00-12:00)', 'Afternoon (12:00-18:00)', 'Night (22:00-04:00)', 'Off-Peak']),
        'confidence_pct': round(random.uniform(78.5, 98.2), 1)
    })

with open('public/data/goods_train_forecast.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=list(goods_fcst[0].keys()))
    writer.writeheader()
    writer.writerows(goods_fcst)

print("Generating historical_block_plans.csv (4,000 rows)...")
hist_plans = []
for i in range(1, 4001):
    blk = block_reqs[(i - 1) % len(block_reqs)]
    method = random.choice(['AI Optimization Engine', 'Manual Rule-Based'])
    conf_count = random.randint(0, 1) if method == 'AI Optimization Engine' else random.randint(3, 8)
    util = round(random.uniform(85.0, 97.5), 1) if method == 'AI Optimization Engine' else round(random.uniform(60.0, 76.0), 1)
    hist_plans.append({
        'historical_plan_id': f"HIST-{i:05d}",
        'block_request_id': blk['block_request_id'],
        'corridor_id': blk['corridor_id'],
        'planned_date': blk['requested_date'],
        'planned_start_time': random_time(),
        'planned_duration_min': blk['requested_duration_min'],
        'planning_method': method,
        'conflict_count': conf_count,
        'utilization_pct': util,
        'status': 'Executed Cleanly' if conf_count == 0 else ('Partial Conflict' if conf_count < 4 else 'Cancelled')
    })

with open('public/data/historical_block_plans.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=list(hist_plans[0].keys()))
    writer.writeheader()
    writer.writerows(hist_plans)

print("Generating train_movement_windows.csv (15,059 rows)...")
movements = []
for i in range(1, 15060):
    sh = random.randint(0, 22)
    sm = random.choice([0, 15, 30, 45])
    arr = f"{sh:02d}:{sm:02d}"
    nxt_h = min(sh + random.choice([0, 1]), 23)
    nxt_m = (sm + random.choice([20, 35, 50])) % 60
    nxt_arr = f"{nxt_h:02d}:{nxt_m:02d}"
    movements.append({
        'movement_id': f"MOV-{i:05d}",
        'train_no': random.choice([12301, 12951, 22436, 12002, 12626, 54321, 58901]),
        'from_station_sequence': random.randint(1, 8),
        'corridor_id': f"COR-{random.randint(1, 100):03d}",
        'from_station_code': random.choice(['NDLS', 'HWH', 'CSMT', 'MAS', 'SBC', 'SC', 'PRYJ', 'LKO']),
        'to_station_code': random.choice(['CNB', 'KGP', 'PUNE', 'BZA', 'MYS', 'KZJ', 'DDU', 'BE']),
        'arrival_time': arr,
        'next_arrival_time': nxt_arr,
        'movement_date': random_date(-5, 25),
        'movement_type': random.choice(['Passenger Express', 'Freight Heavy', 'Suburban Local', 'Special Freight']),
        'conflict_buffer_min': random.randint(2, 35)
    })

with open('public/data/train_movement_windows.csv', 'w', newline='', encoding='utf-8') as f:
    writer = csv.DictWriter(f, fieldnames=list(movements[0].keys()))
    writer.writeheader()
    writer.writerows(movements)

print("All synthetic datasets generated successfully in public/data/")
