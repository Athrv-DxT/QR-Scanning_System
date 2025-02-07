let roomID = "";

function connectToRoom() {
    roomID = document.getElementById("room-id-input").value.trim();
    if (!roomID) {
        alert("Please enter a Room ID.");
        return;
    }
    document.getElementById("connection-form").style.display = "none";
    document.getElementById("scanner-container").style.display = "block";

    startScanning();
}

// Start QR Code Scanning
function startScanning() {
    let scanner = new Html5Qrcode("scanner-preview");
    scanner.start(
        { facingMode: "environment" },  // Use back camera
        { fps: 10, qrbox: 250 }, 
        (decodedText) => {
            sendScanData(decodedText);
            scanner.stop();
        },
        (error) => console.warn("Scanning error:", error)
    );
}

// Send scanned data to backend
async function sendScanData(scannedName) {
    let socket = io("wss://qr-scanning-system.onrender.com");  // FIX 3: Use io() instead of WebSocket

    socket.emit("scan", { room_id: roomID, name: scannedName });

    socket.on("scan_success", () => {
        alert("Sent: " + scannedName);
    });

    socket.on("scan_failed", () => {
        alert("Failed to send data.");
    });
}
