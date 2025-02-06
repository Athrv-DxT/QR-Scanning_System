let socket;

function connectToRoom() {
    let roomID = document.getElementById("room-id").value;
    if (!roomID) {
        alert("Please enter a Room ID.");
        return;
    }

    socket = new WebSocket("wss://your-backend.onrender.com/display?room_id=" + roomID);

    socket.onmessage = function(event) {
        let data = JSON.parse(event.data);
        typeEffect(data.name);
    };

    socket.onopen = () => console.log("Connected to WebSocket for Room ID:", roomID);
    socket.onerror = (error) => console.error("WebSocket Error:", error);
}

function typeEffect(name) {
    let display = document.getElementById("name-display");
    display.innerHTML = "";

    let i = 0;
    function typing() {
        if (i < name.length) {
            display.innerHTML += name[i];
            i++;
            setTimeout(typing, 100);
        }
    }
    typing();
}
