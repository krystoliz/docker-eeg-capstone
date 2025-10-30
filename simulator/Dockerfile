FROM python:3.9-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the local eeg_lib
COPY eeg_lib /app/eeg_lib 
COPY producer.py .

CMD ["python", "producer.py"]