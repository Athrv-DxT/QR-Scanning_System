document.addEventListener("DOMContentLoaded", function () {
    let roomID = "";

    // Connect to WebSocket using SocketIO
    let socket = io("https://qr-scanning-system.onrender.com");

    window.connectToRoom = function () {
        roomID = document.getElementById("room-id-input").value.trim();
        if (!roomID) {
            alert("Please enter a Room ID.");
            return;
        }

        document.getElementById("connection-form").style.display = "none";
        document.getElementById("scanner-container").style.display = "block";

        // Join the room
        socket.emit("join", { room_id: roomID });

        startScanning();
    };

    // Start QR Code Scanning
    function startScanning() {
        let scanner = new Html5Qrcode("scanner-preview");

        scanner.start(
            { facingMode: "environment" }, // Use back camera
            { fps: 10, qrbox: 250 },
            (decodedText) => {
                sendScanData(decodedText);
                scanner.stop();
            },
            (error) => console.warn("Scanning error:", error)
        );
    }

    // Send scanned data to backend via SocketIO
    function sendScanData(scannedName) {
        console.log("Sending:", scannedName);
        socket.emit("scan", { room_id: roomID, name: scannedName });
    }

    socket.on("connect_error", (error) => {
        console.error("WebSocket Connection Error:", error);
    });

    socket.on("disconnect", () => {
        console.log("WebSocket Disconnected.");
    });
});
