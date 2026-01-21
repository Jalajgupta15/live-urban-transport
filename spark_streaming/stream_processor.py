from pyspark.sql import SparkSession
from pyspark.sql.functions import from_json, col
from pyspark.sql.types import *

spark = SparkSession.builder \
    .appName("LiveUrbanTransport") \
    .getOrCreate()

# Define schema
schema = StructType([
    StructField("vehicle_id", StringType()),
    StructField("route_id", StringType()),
    StructField("delay_minutes", IntegerType()),
    StructField("event_time", StringType())
])

# Read stream from Kafka
raw_df = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "localhost:9092") \
    .option("subscribe", "transport_stream") \
    .load()

parsed_df = raw_df.select(
    from_json(col("value").cast("string"), schema).alias("data")
).select("data.*")

# Spark SQL usage
parsed_df.createOrReplaceTempView("transport_events")

metrics_df = spark.sql("""
    SELECT
        route_id,
        COUNT(*) AS total_events,
        ROUND(AVG(delay_minutes), 2) AS avg_delay,
        CASE
            WHEN AVG(delay_minutes) <= 5 THEN 'GOOD'
            WHEN AVG(delay_minutes) <= 10 THEN 'MODERATE'
            ELSE 'CRITICAL'
        END AS route_status
    FROM transport_events
    GROUP BY route_id
""")

query = metrics_df.writeStream \
    .outputMode("complete") \
    .format("csv") \
    .option("path", "storage/csv") \
    .option("checkpointLocation", "checkpoint/metrics") \
    .option("header", "true") \
    .start()

query.awaitTermination()
