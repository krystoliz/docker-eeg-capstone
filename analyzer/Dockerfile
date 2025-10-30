FROM python:3.9-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the local eeg_lib
COPY eeg_lib /app/eeg_lib

# --- ADD THIS LINE ---
# Copy the model file into the container's /app directory
COPY ensemble_model_v2.joblib .
# ---------------------

COPY consumer.py .

CMD ["python", "consumer.py"]