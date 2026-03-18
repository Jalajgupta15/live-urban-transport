

# 🚗 Real-Time Vehicle Analytics Pipeline

🌐 **Live Demo**
👉 [https://jalajgupta15.github.io/live-urban-transport/](https://jalajgupta15.github.io/live-urban-transport/)

---

## 📌 Project Overview

This project demonstrates a **real-time data analytics pipeline** designed to simulate, process, and visualize live vehicle data.

It showcases how data flows through an end-to-end system  from **real-time generation to analytics consumption**  using modern data engineering tools and scalable design patterns.

The objective was not just to build a working system, but to understand **how real-world streaming architectures operate**, focusing on clarity, modularity, and extensibility.

---

## 🧠 What I Built

* A **live data generator** to simulate vehicle movement
* A **Spark Streaming pipeline** for near real-time processing
* A **CSV-based analytics layer** for simplicity and transparency
* A **Flask REST API** to expose processed insights
* A **frontend dashboard / BI-ready interface** for visualization

This project emphasizes **data flow, architecture, and scalability**, rather than UI complexity.

---

## 🏗️ Project Structure

```bash
analytics/
 └── powerbi_export.py        # Prepares latest analytics output for dashboards

backend/
 └── api_server.py            # Flask API exposing processed data

data_generator/
 └── vehicle_stream_producer.py  # Simulates live vehicle data stream

spark_streaming/
 └── stream_processor.py      # Spark Streaming processing logic

scripts/
 └── run_pipeline.sh          # Runs the complete pipeline

web/
 ├── app.js                   # Fetches live data from API
 └── index.html               # Dashboard UI
```

---

## 🔄 End-to-End Data Flow

```
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
```

---

## ⚙️ Components Explained

### 1️⃣ Data Generator

**`vehicle_stream_producer.py`**

Simulates real-time vehicle events such as speed, location, and vehicle ID.
Acts as the **streaming source** for the pipeline.

---

### 2️⃣ Spark Streaming

**`stream_processor.py`**

Processes live data streams and performs aggregations such as:

* Average speed per vehicle
* Vehicle activity counts
* Time-based metrics

Outputs results as **timestamped CSV files**.

---

### 3️⃣ Analytics Export

**`powerbi_export.py`**

* Reads latest Spark output
* Adds a `last_updated` timestamp
* Writes a stable file:

```bash
storage/csv/latest_metrics.csv
```

This ensures:

* Easy Power BI integration
* Consistent file reference
* Simple debugging

---

### 4️⃣ Backend API

**`api_server.py`**

Built using Flask, this layer exposes analytics through a REST API.

**Endpoint:**

```bash
GET /data
```

**Response:**

* JSON-formatted analytics
* Reads directly from `latest_metrics.csv`

This enables seamless integration with:

* Frontend dashboards
* BI tools
* External systems

---

### 5️⃣ Frontend

**`web/`**

A lightweight interface built using HTML and JavaScript that:

* Fetches data from the API
* Displays near real-time insights

---

## 🚀 How to Run the Project

### 1️⃣ Install Dependencies

Ensure the following are installed:

* Python
* Apache Spark
* Required libraries:

```bash
pip install pandas flask
```

---

### 2️⃣ Run the Pipeline

```bash
bash scripts/run_pipeline.sh
```

This will:

* Start the data generator
* Run Spark Streaming
* Launch the Flask API

---

### 3️⃣ Access API

```bash
http://localhost:5000/data
```

---

### 4️⃣ Power BI Integration

Connect Power BI to:

```bash
storage/csv/latest_metrics.csv
```

Set periodic refresh for near real-time analytics.

---

## ✅ Key Design Decisions

* **CSV-based data layer** → Simple, transparent, and debuggable
* **Decoupled architecture** → Independent components for flexibility
* **Single stable output file** → Easy BI integration
* **API-first design** → Scalable and extensible system

---

## 🔮 Future Enhancements

* Replace CSV with **Parquet / DuckDB / PostgreSQL**
* Integrate **Kafka for real-world streaming**
* Deploy using **Docker & cloud services**
* Add **real-time dashboards (React / Streamlit)**

---

## 🧑‍💻 Author

**Jalaj Gupta**

---

