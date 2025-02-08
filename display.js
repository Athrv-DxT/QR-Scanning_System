document.addEventListener("DOMContentLoaded", function () {
    let roomID = generateRoomCode();
    document.getElementById("room-id").innerText = roomID;

    function generateRoomCode() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    window.startDisplay = function () {
        let setupElement = document.getElementById("setup");
        let displayContainer = document.getElementById("display-container");
        let welcomeText = document.getElementById("welcome-text");

        if (!setupElement || !displayContainer) {
            console.error("Error: Required elements not found in the DOM.");
            return;
        }

        setupElement.style.display = "none";
        displayContainer.style.display = "block";
        welcomeText.style.display = "block"; // Show welcome text when Room Code is entered

        let socket = io("wss://qr-scanning-system.onrender.com");

        socket.on("connect", () => {
            console.log("WebSocket Connected!");
            socket.emit("join", { room_id: roomID });
        });

        socket.on("new_scan", function (data) {
            console.log("Received:", data.name);
            typeEffect(data.name);
        });

        socket.on("disconnect", () => console.log("WebSocket Disconnected."));
    };

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
