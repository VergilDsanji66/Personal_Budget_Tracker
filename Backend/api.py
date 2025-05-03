from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
from shared_data import memory_db_1, memory_db_2  # Import shared state

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# WebSocket connections pool
active_connections_1 = []

# Pydantic model for date range
class DateRange(BaseModel):
    start: str
    end: str

# WebSocket endpoint
@app.websocket("/ws/db1")
async def websocket_endpoint_1(websocket: WebSocket):
    await websocket.accept()
    active_connections_1.append(websocket)
    try:
        # Send initial state when connection is established
        await websocket.send_json({
            "memory_db_1": memory_db_1,
            "memory_db_2": memory_db_2
        })
        
        while True:
            data = await websocket.receive_text()
            if data == "get_date_range":
                await websocket.send_json({
                    "memory_db_1": memory_db_1,
                    "memory_db_2": memory_db_2
                })
    except WebSocketDisconnect:
        active_connections_1.remove(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")

# Single endpoint for date range updates
@app.post("/date_range/db1")
async def update_date_range(date_range: DateRange):
    memory_db_1["start_date"] = date_range.start
    memory_db_1["end_date"] = date_range.end
    
    # Process data immediately
    from data_loader import load_and_process_data
    load_and_process_data()  # This updates memory_db_2
    
    # Broadcast to all WebSocket clients
    for connection in active_connections_1:
        try:
            await connection.send_json({
                "memory_db_1": memory_db_1,
                "memory_db_2": memory_db_2
            })
        except Exception as e:
            print(f"Error sending WebSocket update: {e}")
            active_connections_1.remove(connection)
    
    return {"message": "Date range and financial data updated"}

# Add endpoint to get current results
@app.get("/results/db2")
async def get_results():
    return memory_db_2

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)