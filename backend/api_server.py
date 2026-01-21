from flask import Flask, jsonify
import pandas as pd
import os

app = Flask(__name__)

@app.route("/data")
def get_live_data():
    file_path = "storage/csv/latest_metrics.csv"
    if not os.path.exists(file_path):
        return jsonify([])
    df = pd.read_csv(file_path)
    return jsonify(df.to_dict(orient="records"))

if __name__ == "__main__":
    app.run(port=5000, debug=False)
