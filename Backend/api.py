from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development purposes
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Memory database for date ranges
memory_db_1 = { # Store date ranges for memory_db_1
    "start_date": None,
    "end_date": None
}

memory_db_2 = { # Store money summary for memory_db_2

}

class DateRange(BaseModel):
    start: str
    end: str

# To store the WebSocket connections for memory_db_1
active_connections_1 = []

# WebSocket endpoint for memory_db_1
@app.websocket("/ws/db1")
async def websocket_endpoint_1(websocket: WebSocket):
    await websocket.accept()
    active_connections_1.append(websocket)

    try:
        while True:
            data = await websocket.receive_text()
            if data == "get_date_range":
                await websocket.send_json(memory_db_1)  # Send current date range for memory_db_1
    except WebSocketDisconnect:
        active_connections_1.remove(websocket)

# POST endpoint for updating memory_db_1
@app.post("/date_range/db1")
async def date_range_db1(date_range: DateRange):
    memory_db_1["start_date"] = date_range.start
    memory_db_1["end_date"] = date_range.end
    
    # Broadcast the updated date range to all connected WebSocket clients for memory_db_1
    for connection in active_connections_1:
        await connection.send_json(memory_db_1)
    
    return {"message": "Date range for DB1 updated successfully"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
