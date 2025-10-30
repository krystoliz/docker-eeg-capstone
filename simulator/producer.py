import time
import json
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable
from eeg_lib.features import simulate_eeg_pair # <-- Import your function


TOPIC_NAME = 'eeg_signals'
KAFKA_SERVER = 'kafka:9092'
SIMULATION_SR = 256
SIMULATION_DURATION = 6.0 # 6 second epoch

print(f"Connecting to Kafka broker at {KAFKA_SERVER}...")

producer = None
for _ in range(10):
    try:
        producer = KafkaProducer(
            bootstrap_servers=[KAFKA_SERVER],
            value_serializer=lambda v: json.dumps(v).encode('utf-8')
        )
        print("Successfully connected to Kafka!")
        break
    except NoBrokersAvailable:
        print("Kafka broker not available. Retrying in 5 seconds...")
        time.sleep(5)
if not producer:
    print("Failed to connect to Kafka. Exiting.")
    exit()

print(f"Starting to send {SIMULATION_DURATION}s epochs to topic '{TOPIC_NAME}'...")
try:
    while True:
        # 1. Generate a 6-second, 2-channel epoch
        t, ch1, ch2 = simulate_eeg_pair(sr=SIMULATION_SR, duration=SIMULATION_DURATION)
        
        # 2. Package the raw data for Kafka
        # We send the raw lists, not single values
        data = {
            'channel_1': ch1,
            'channel_2': ch2,
            'sr': SIMULATION_SR,
            'timestamp': time.time()
        }

        # 3. Send the entire epoch as one message
        producer.send(TOPIC_NAME, value=data)
        producer.flush()
        print(f"Sent epoch with {len(ch1)} samples.")

        # 4. Wait for the duration of the epoch to send the next one
        time.sleep(SIMULATION_DURATION)

except KeyboardInterrupt:
    print("Simulation stopped.")
finally:
    producer.close()
    print("Kafka producer closed.")