
import pandas as pd
import os

CSV_DIR = "storage/csv"
OUTPUT_FILE = "storage/csv/latest_metrics.csv"

files = [f for f in os.listdir(CSV_DIR) if f.endswith(".csv")]

if files:
    latest_file = os.path.join(CSV_DIR, sorted(files)[-1])
    df = pd.read_csv(latest_file)
    df["last_updated"] = pd.Timestamp.now()
    df.to_csv(OUTPUT_FILE, index=False)
