let socket;
let roomID = generateRoomCode(); // Generate random 4-digit Room ID

document.getElementById("room-id").innerText = roomID;

function generateRoomCode() {
    return Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit code
}

function startDisplay() {
    socket = new WebSocket("wss://qr-scanning-system.onrender.com/display?room_id=" + roomID);

    socket.onmessage = function (event) {
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

// Start WebSocket connection on page load
window.onload = startDisplay;
