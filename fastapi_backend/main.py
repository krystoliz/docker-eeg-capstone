from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Query, Depends, HTTPException
from typing import List, Dict, Any, Optional
import json
import jwt
import os
import pymongo
from datetime import datetime
from bson.objectid import ObjectId
from bson.errors import InvalidId # <-- 1. THIS IS THE CORRECT IMPORT

# --- Environment Variables ---
JWT_SECRET = os.environ.get('JWT_SECRET')
MONGO_URI = os.environ.get('MONGO_URI')
MONGO_DB_NAME = os.environ.get('MONGO_DB_NAME')

if not JWT_SECRET:
    raise EnvironmentError("FATAL ERROR: JWT_SECRET environment variable not set.")
if not MONGO_URI:
    raise EnvironmentError("FATAL ERROR: MONGO_URI environment variable not set.")
if not MONGO_DB_NAME:
    raise EnvironmentError("FATAL ERROR: MONGO_DB_NAME environment variable not set.")

ALGORITHM = "HS256"

# --- MongoDB Connection ---
try:
    mongo_client = pymongo.MongoClient(MONGO_URI)
    db = mongo_client[MONGO_DB_NAME]
    emotion_collection = db["emotiondata"]
    mongo_client.server_info()
    print(f"FastAPI connected to MongoDB (DB: {MONGO_DB_NAME})!")

    class ConnectionManager:
        def __init__(self, collection):
            self.active_connections: List[(WebSocket, str)] = []
            self.collection = collection

        async def connect(self, websocket: WebSocket, user_id: str):
            await websocket.accept()
            self.active_connections.append((websocket, user_id))

        def disconnect(self, websocket: WebSocket):
            conn_to_remove = None
            for conn in self.active_connections:
                if conn[0] == websocket:
                    conn_to_remove = conn
                    break
            if conn_to_remove:
                self.active_connections.remove(conn_to_remove)

        async def broadcast(self, data: str, db_document: dict):
            for (connection, user_id) in self.active_connections:
                await connection.send_text(data)
                
                try:
                    db_doc_copy = db_document.copy()
                    
                    try:
                        db_doc_copy["userId"] = ObjectId(user_id)
                    except InvalidId: # <-- 2. THIS IS THE CORRECT EXCEPTION
                        print(f"Error: Invalid userId format: {user_id}. Skipping save.")
                        continue 

                    db_doc_copy["savedAt"] = datetime.utcnow()
                    self.collection.insert_one(db_doc_copy)
                except Exception as e:
                    print(f"Error saving to MongoDB: {e}")
    
    manager = ConnectionManager(emotion_collection)

except Exception as e:
    print(f"FATAL ERROR: Could not connect to MongoDB: {e}")
    exit(1)
    
app = FastAPI()

# --- (Rest of the file is unchanged) ---

async def get_token(token: Optional[str] = Query(None)):
    if token is None:
        raise HTTPException(status_code=401, detail="No token provided")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

@app.post("/data")
async def receive_data(data: Dict[str, Any]):
    json_data = json.dumps(data)
    await manager.broadcast(json_data, data)
    return {"status": "success", "message": "Data broadcasted and logged"}

@app.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    payload: dict = Depends(get_token)
):
    user_id = payload.get("userId")
    user_email = payload.get("email", "Unknown User")
    
    if not user_id:
        print("Token payload missing 'userId'. Disconnecting.")
        return

    await manager.connect(websocket, user_id)
    print(f"Client '{user_email}' (ID: {user_id}) connected.")
    
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        print(f"Client '{user_email}' disconnected.")