from flask import Flask, request
from flask_socketio import SocketIO, join_room, emit
from flask_cors import CORS
import eventlet

eventlet.monkey_patch()  # Prevents WebSocket issues

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Allow cross-origin requests

# Initialize SocketIO with eventlet support
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

@app.route('/')
def home():
    return "QR Scanning System Backend Running"

@socketio.on("connect")
def handle_connect():
    print("Client connected")

@socketio.on("join")
def handle_join(data):
    room_id = data.get("room_id")
    if room_id:
        join_room(room_id)
        print(f"Client joined room {room_id}")

@socketio.on("scan")
def handle_scan(data):
    room_id = data.get("room_id")
    name = data.get("name")
    if room_id and name:
        print(f"Received scan: {name} for room {room_id}")
        emit("new_scan", {"name": name}, room=room_id)  # Notify display
        emit("scan_success", room=request.sid)  # Confirm scan success to scanner
    else:
        emit("scan_failed", room=request.sid)  # Notify scanner of failure

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
