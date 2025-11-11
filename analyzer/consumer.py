import time
import json
import requests
from kafka import KafkaConsumer
from kafka.errors import NoBrokersAvailable

# Import your feature functions
from eeg_lib.features import extract_features, feature_order
import pandas as pd
import numpy as np
import joblib # <-- NEW: Import joblib

TOPIC_NAME = 'eeg_signals'
KAFKA_SERVER = 'kafka:9092'
FASTAPI_ENDPOINT = 'http://fastapi_backend:8000/data'

print(f"Connecting to Kafka broker at {KAFKA_SERVER}...")

consumer = None
for _ in range(10): 
    try:
        consumer = KafkaConsumer(
            TOPIC_NAME,
            bootstrap_servers=[KAFKA_SERVER],
            auto_offset_reset='latest',
            value_deserializer=lambda v: json.loads(v.decode('utf-8'))
        )
        print("Successfully connected to Kafka!")
        break
    except NoBrokersAvailable:
        print("Kafka broker not available. Retrying in 5 seconds...")
        time.sleep(5)

if not consumer:
    print("Failed to connect to Kafka. Exiting.")
    exit()


# --- NEW: Load your model ---
try:
    print("Loading ensemble model...")
    # We copied the file to the root of /app in the Dockerfile
    model = joblib.load('ensemble_model_v2.joblib')
    print("Model loaded successfully.")
except FileNotFoundError:
    print("FATAL ERROR: ensemble_model_v2.joblib not found.")
    print("Please make sure it's in the 'analyzer' directory.")
    exit()
except Exception as e:
    print(f"FATAL ERROR: Could not load model. {e}")
    exit()

# --- NEW: Define label mapping ---
LABEL_MAP = {
    0: "Negative",
    1: "Neutral",
    2: "Positive"
}


print(f"Listening for epoch messages on topic '{TOPIC_NAME}'...")

try:
    for message in consumer:
        # 1. Get the epoch data
        epoch_data = message.value
        if 'synthetic_features' in epoch_data:
            print("Received synthetic feature vector. Skipping signal extraction...")
            features_dict = epoch_data['synthetic_features']
            sr = epoch_data.get('sr', 256)  # fallback if not present
            num_samples = None
        else:
            print("Received raw signal. Running feature extraction...")
            ch1 = epoch_data['channel_1']
            ch2 = epoch_data['channel_2']
            sr = epoch_data['sr']
            features_dict = extract_features(ch1, ch2, sr=sr)
            num_samples = len(ch1)
        
        # 3. Create DataFrame for prediction
        # Create a single row DataFrame, ensuring the column order
        # matches your model's training order (from eeg_lib.features)
        df_row = pd.DataFrame([features_dict], columns=feature_order)
        
        # 4. --- REAL CLASSIFICATION ---
        # Perform inference
        prediction_array = model.predict(df_row)
        prediction = prediction_array[0] # Get the single element
        
        # Map the numeric prediction (0, 1, or 2) to a string label
        emotion = LABEL_MAP.get(prediction, "Unknown") # Default to "Unknown"
        
        # 5. Package data for the frontend
        classified_data = {
            'original_data': {
            'timestamp': epoch_data['timestamp'],
            'sr': sr,
            'num_samples': num_samples if num_samples is not None else "synthetic"
                },

            'classified_emotion': emotion, # This is now "Negative", "Neutral", or "Positive"
            'analysis_timestamp': time.time(),
            'key_features': {
                'alpha': features_dict['CH1_P_alpha'],
                'beta': features_dict['CH1_P_beta'],
                'asymmetry': features_dict['alpha_asymmetry']
            }
        }
        
        # 6. Send to FastAPI
        try:
            response = requests.post(FASTAPI_ENDPOINT, json=classified_data)
            print(f"CLASSIFIED: {emotion} | Sent to FastAPI: {response.status_code}")
        
        except requests.exceptions.ConnectionError as e:
            print(f"Error: Could not connect to FastAPI at {FASTAPI_ENDPOINT}")

except KeyboardInterrupt:
    print("Consumer stopped.")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    consumer.close()
    print("Kafka consumer closed.")