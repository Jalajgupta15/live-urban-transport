🚗 Real-Time Vehicle Analytics Pipeline
🌐 Live Demo
👉 https://jalajgupta15.github.io/live-urban-transport/

📌 Project Overview
This project demonstrates a real-time data analytics pipeline built to simulate, process, and visualize live vehicle data.
The system ingests streaming data, processes it using Spark Streaming, stores analytical results, and exposes them through APIs for dashboards and BI tools like Power BI.
The main goal of this project was to understand end-to-end data flow in a real-time system—from data generation to analytics consumption—using industry-relevant tools and design patterns.

🧠 What I Built

A live data generator to simulate vehicle movement data
A Spark Streaming processor to analyze streaming data in near real time
A CSV-based analytics layer for simplicity and debuggability
A Flask backend API to serve processed metrics
A frontend / BI-ready interface to consume and visualize data

This project focuses on architecture clarity, data flow, and scalability, rather than UI-heavy implementation.

🏗️ Project Structure
analytics/
 └── powerbi_export.py        # Prepares latest analytics output for dashboards

backend/
 └── api_server.py            # Flask API exposing processed data

data_generator/
 └── vehicle_stream_producer.py  # Simulates live vehicle data stream

spark_streaming/
 └── stream_processor.py      # Spark Streaming logic for processing data

scripts/
 └── run_pipeline.sh          # Script to run the full pipeline

web/
 ├── app.js                   # Frontend logic to fetch live data
 └── index.html               # Dashboard UI

🔄 End-to-End Data Flow
Vehicle Data Generator
        ↓
Spark Streaming Processor
        ↓
Timestamped CSV Metrics
        ↓
Latest Metrics Export
        ↓
Flask REST API
        ↓
Web Dashboard / Power BI

⚙️ Component Explanation
1️⃣ Data Generator (vehicle_stream_producer.py)

Simulates real-time vehicle events (speed, location, vehicle ID, etc.)
Acts as a streaming data source for Spark


2️⃣ Spark Streaming (stream_processor.py)

Consumes live vehicle data
Performs aggregations and transformations
Writes analytics output as timestamped CSV files

Example metrics:

Average speed per vehicle
Vehicle activity counts
Time-based aggregations


3️⃣ Analytics Export (powerbi_export.py)

Reads the latest Spark-generated CSV
Adds a last_updated timestamp
Writes a stable output file:
storage/csv/latest_metrics.csv

This design ensures:

Easy Power BI integration
No dependency on changing filenames
Simple debugging and inspection


4️⃣ Backend API (api_server.py)

Built using Flask
Exposes processed analytics via REST endpoint

Endpoint
GET /data
Response

JSON-formatted analytics records
Reads directly from latest_metrics.csv

This allows:

Frontend dashboards
External tools
BI platforms to consume the same data source


5️⃣ Frontend (web/)

Lightweight HTML + JavaScript
Fetches data from Flask API
Displays near real-time analytics


🚀 How to Run the Project
1️⃣ Install Dependencies
Make sure you have:

Python
Apache Spark
Required Python libraries (pandas, flask, etc.)


2️⃣ Start the Pipeline
bashbash scripts/run_pipeline.sh
This script:

Starts the data generator
Runs Spark streaming
Launches the Flask API


3️⃣ Access the API
http://localhost:5000/data

4️⃣ Power BI Integration

Connect Power BI to:

storage/csv/latest_metrics.csv

Refresh periodically for near real-time insights


✅ Key Design Decisions

CSV-based exchange layer for simplicity and transparency
Decoupled architecture between Spark, API, and frontend
Single stable output file for BI tools
API-first approach for extensibility

This design can later be extended to:

Databases (PostgreSQL, DuckDB)
Parquet storage
Kafka-based production pipelines


🧑‍💻 Author
Jalaj Gupta
GitHub · Live Demo
