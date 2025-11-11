import time
import json
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable
# from eeg_lib.features import simulate_eeg_pair # <-- Import your function
from eeg_lib.features import simulate_eeg_pair, generate_synthetic_features, load_feature_stats, feature_order

import os
GENERATOR_MODE = os.getenv('GENERATOR_MODE', 'signal')  # 'signal' or 'feature'

TOPIC_NAME = 'eeg_signals'
KAFKA_SERVER = 'kafka:9092'
SIMULATION_SR = 256
SIMULATION_DURATION = 6.0 # 6 second epoch

print(f"Connecting to Kafka broker at {KAFKA_SERVER}...")

producer = None

if GENERATOR_MODE == 'feature':
    print("Loading feature statistics for synthetic generation...")
    means, stds = load_feature_stats('simulator/dataset_adapted.csv')
    label_cycle = ['NEGATIVE', 'NEUTRAL', 'POSITIVE']
    label_index = 0

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
        if GENERATOR_MODE == 'signal':
            # Signal-based simulation
            t, ch1, ch2 = simulate_eeg_pair(sr=SIMULATION_SR, duration=SIMULATION_DURATION)
            data = {
                'channel_1': ch1,
                'channel_2': ch2,
                'sr': SIMULATION_SR,
                'timestamp': time.time()
            }
        else:
            # Feature-space generation
            label = label_cycle[label_index % len(label_cycle)]
            label_index += 1
            feats = generate_synthetic_features(label, means, stds)
            data = {
                'synthetic_features': {k: feats[k] for k in feature_order},
                'sr': SIMULATION_SR,
                'timestamp': time.time()
            }

        producer.send(TOPIC_NAME, value=data)
        producer.flush()
        print(f"Sent {'features' if GENERATOR_MODE=='feature' else 'epoch'} at {data['timestamp']}")
        time.sleep(SIMULATION_DURATION)

except KeyboardInterrupt:
    print("Simulation stopped.")
finally:
    producer.close()
    print("Kafka producer closed.")