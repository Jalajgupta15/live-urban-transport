echo "Starting Kafka Producer..."
python3 data_generator/vehicle_stream_producer.py &

echo "Starting Spark Streaming Job..."
spark-submit spark_streaming/stream_processor.py &

echo "Starting Backend API..."
python3 backend/api_server.py

"""
chmod +x scripts/run_pipeline.sh
"""
