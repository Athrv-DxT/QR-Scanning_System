async function startScanning() {
    let roomID = document.getElementById("room-id").value;
    if (!roomID) {
        alert("Please enter a Room ID first.");
        return;
    }

    const scanner = new Html5Qrcode("scanner-preview");

    scanner.start(
        { facingMode: "environment" }, // Use rear camera
        {
            fps: 10,
            qrbox: { width: 250, height: 250 }
        },
        async (decodedText) => {
            console.log("Scanned QR Code:", decodedText);
            await sendScanData(roomID, decodedText);
            scanner.stop(); // Stop scanning after a successful scan
        },
        (error) => {
            console.warn("QR Code scanning error:", error);
        }
    );
}

// Function to send scanned data to backend
async function sendScanData(roomID, scannedName) {
    try {
        let response = await fetch("https://qr-scanning-system.onrender.com", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ room_id: roomID, name: scannedName })
        });

        if (response.ok) {
            alert("Scan successful!");
        } else {
            alert("Error sending data to the backend.");
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Network error while sending data.");
    }
}
