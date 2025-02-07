document.addEventListener("DOMContentLoaded", function () {
    // Generate a random Room Code and display it
    let roomID = generateRoomCode();
    document.getElementById("room-id").innerText = roomID;

    function generateRoomCode() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    // Connect to WebSocket using SocketIO
    let socket = io("https://qr-scanning-system.onrender.com");

    window.startDisplay = function () {
        let setupElement = document.getElementById("setup");
        let displayContainer = document.getElementById("display-container");

        // Ensure elements exist before modifying their styles
        if (!setupElement || !displayContainer) {
            console.error("Error: Required elements not found in the DOM.");
            return;
        }

        setupElement.style.display = "none";
        displayContainer.style.display = "block";

        // Join the Room
        socket.emit("join", { room_id: roomID });

        socket.on("name", function (data) {
            if (data.name) {
                console.log("Received:", data.name);
                typeEffect(data.name);
            }
        });

        socket.on("connect_error", (error) => {
            console.error("WebSocket Connection Error:", error);
        });

        socket.on("disconnect", () => {
            console.log("WebSocket Disconnected.");
        });
    };

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
});
