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
        { facingMode: "environment" }, // Use back camera
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            console.log("Scanned:", decodedText);
            sendScanData(decodedText);
            setTimeout(() => scanner.resume(), 2000); // Restart scanning after sending data
        },
        (error) => console.warn("Scanning error:", error)
    );
}

// Send scanned data to backend
async function sendScanData(scannedName) {
    try {
        let response = await fetch("https://qr-scanning-system.onrender.com/scan", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room_id: roomID, name: scannedName })
        });

        if (response.ok) {
            console.log("Sent:", scannedName);
        } else {
            console.error("Failed to send data.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
