from flask import Flask, request, jsonify
from flask_socketio import SocketIO, emit, join_room
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route("/")
def home():
    return "Backend is Live!"

@app.route("/scan", methods=["POST"])
def scan():
    """Receives scanned name and broadcasts it to the correct room."""
    data = request.json
    room_id = data.get("room_id")
    name = data.get("name")

    if not room_id or not name:
        return jsonify({"error": "Missing room_id or name"}), 400

    # Emit scanned name to the correct room
    socketio.emit("new_scan", {"name": name}, room=room_id)
    return jsonify({"message": "Scan received"}), 200

@socketio.on("join")
def join(data):
    """Handles display joining a specific room."""
    room_id = data.get("room_id")
    join_room(room_id)

if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)
