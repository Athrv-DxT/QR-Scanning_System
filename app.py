from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room
import eventlet

eventlet.monkey_patch()  # Required for SocketIO to work properly on Render

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")  # Enable WebSocket support

# In-memory storage for rooms (Optional, but helps track active rooms)
active_rooms = {}

@app.route("/")
def home():
    return "QR Scanning System Backend is Live!"

# Route for mobile scanner to send scanned names
@app.route("/scan", methods=["POST"])
def scan():
    data = request.json
    room_id = data.get("room_id")
    name = data.get("name")

    if not room_id or not name:
        return jsonify({"error": "Missing room_id or name"}), 400

    print(f"Received scan: {name} for Room {room_id}")
    
    # Send the name to all displays in the room via WebSocket
    socketio.emit("new_scan", {"name": name}, room=room_id)

    return jsonify({"message": "Scan sent successfully"}), 200

# WebSocket: Handle a new connection from Display or Scanner
@socketio.on("join")
def handle_join(data):
    room_id = data.get("room_id")

    if not room_id:
        return

    join_room(room_id)
    active_rooms.setdefault(room_id, []).append(request.sid)
    
    print(f"Client {request.sid} joined Room {room_id}")

    emit("joined", {"message": f"Joined Room {room_id}"}, room=request.sid)

# WebSocket: Receive scanned name and broadcast it to the display
@socketio.on("scan")
def handle_scan(data):
    room_id = data.get("room_id")
    name = data.get("name")

    if not room_id or not name:
        return

    print(f"Broadcasting scan: {name} to Room {room_id}")
    emit("new_scan", {"name": name}, room=room_id)

if __name__ == "__main__":
    print("Starting server...")
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
