// Generate a random Room Code and display it
let roomID = generateRoomCode();
document.getElementById("room-id").innerText = roomID;

function generateRoomCode() {
    return Math.floor(1000 + Math.random() * 9000).toString();
}

function startDisplay() {
    let setupElement = document.getElementById("setup");
    let displayContainer = document.getElementById("display-container");

    if (!setupElement || !displayContainer) {
        console.error("Required elements are missing from HTML.");
        return;
    }

    setupElement.style.display = "none";
    displayContainer.style.display = "block";

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
