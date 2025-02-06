// Generate a random Room Code
let roomID = generateRoomCode();
document.getElementById("room-id").innerText = roomID;

function generateRoomCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function startDisplay() {
    document.getElementById("setup").style.display = "none";
    document.getElementById("display-container").style.display = "block";

    let socket = new WebSocket("wss://qr-scanning-system.onrender.com");

    socket.onopen = () => {
        console.log("WebSocket Connected!");
        socket.send(JSON.stringify({ action: "join", room_id: roomID }));
    };

    socket.onmessage = function (event) {
        let data = JSON.parse(event.data);
        if (data.name) {
            console.log("Received:", data.name);
            typeEffect(data.name);
        }
    };

    socket.onerror = (error) => console.error("WebSocket Error:", error);
    socket.onclose = () => console.log("WebSocket Closed.");
}

// Typing effect for displaying names
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
