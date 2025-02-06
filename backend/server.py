from flask import Flask, request
from flask_socketio import SocketIO, join_room, leave_room

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@app.route('/scan', methods=['POST'])
def scan():
    data = request.json
    room_id = data.get("room_id")
    name = data.get("name")

    if room_id and name:
        socketio.emit("new_scan", {"name": name}, room=room_id)
        return {"status": "success"}, 200
    return {"status": "error"}, 400

@socketio.on('join')
def on_join(data):
    room_id = data["room_id"]
    join_room(room_id)
    print(f"Laptop joined room {room_id}")

@socketio.on('leave')
def on_leave(data):
    room_id = data["room_id"]
    leave_room(room_id)
    print(f"Laptop left room {room_id}")

if __name__ == '__main__':
    socketio.run(app, host="0.0.0.0", port=5000, debug=True)
