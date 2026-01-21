import json
import time
import random
from datetime import datetime
from kafka import KafkaProducer

producer = KafkaProducer(
    bootstrap_servers="localhost:9092",
    value_serializer=lambda x: json.dumps(x).encode("utf-8")
)

ROUTES = ["R1", "R2", "R3", "R4"]

def generate_event():
    return {
        "vehicle_id": f"BUS_{random.randint(1, 50)}",
        "route_id": random.choice(ROUTES),
        "delay_minutes": random.randint(0, 15),
        "event_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }

if __name__ == "__main__":
    while True:
        event = generate_event()
        producer.send("transport_stream", event)
        time.sleep(1)
