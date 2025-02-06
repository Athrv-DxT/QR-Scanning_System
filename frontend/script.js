// for laptop screens

var socket = io("https://your-backend.onrender.com");

function joinRoom() {
    let roomID = document.getElementById("room").value;
    if (!roomID) {
        alert("Enter a Room ID first!");
        return;
    }
    socket.emit("join", { room_id: roomID });
    console.log("Joined room: " + roomID);
}

socket.on("new_scan", function(data) {
    document.getElementById("name-display").innerText = "Scanned: " + data.name;
});

// for mobile devices

let roomID = "";

function sendToServer(name) {
    fetch("https://your-backend.onrender.com/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ room_id: roomID, name: name })
    }).then(response => response.json())
      .then(data => console.log("Server Response:", data))
      .catch(error => console.error("Error:", error));
}

function onScanSuccess(decodedText) {
    if (!roomID) {
        alert("Enter a Room ID first!");
        return;
    }
    sendToServer(decodedText);
}

function startScanner() {
    roomID = document.getElementById("room").value;
    if (!roomID) {
        alert("Enter a Room ID first!");
        return;
    }
    let scanner = new Html5Qrcode("reader");
    scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        onScanSuccess
    );
}
