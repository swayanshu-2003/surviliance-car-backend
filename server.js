const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

// Create an Express app
const app = express();
app.use(cors());
app.use(express.json());

// WebSocket servers
const wss = new WebSocket.Server({ port: 5800, host: "0.0.0.0" });
const espCamWss = new WebSocket.Server({ port: 5900, host: "0.0.0.0" });

let espSocket = null; // ESP module connection
let espCamSocket = null; // ESP-CAM connection
let espPanTiltSocket = null; // Pan-Tilt ESP connection
let espButton = null; // Button ESP connection
let espSensor = null; // Button ESP connection
let frontendSocket = null; // Frontend connection

// ESP-CAM WebSocket server
espCamWss.on("connection", (socket) => {
  console.log("New ESP32-CAM WebSocket connection");

  socket.on("message", (message) => {
    espCamWss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(message);
        } catch (err) {
          console.error("Error sending message to ESP-CAM clients:", err);
        }
      }
    });
  });

  socket.on("close", () => {
    console.log("ESP-CAM module disconnected");
  });

  socket.on("error", (err) => {
    console.error("Error with ESP-CAM socket:", err);
  });
});

// Main WebSocket server
wss.on("connection", (socket, req) => {
  console.log("New WebSocket connection");

  socket.on("message", async (message) => {
    try {
      const data = JSON.parse(message);
      console.log(data);
      if (data) {
        if (data.type === "esp") {
          console.log("ESP module connected");
          espSocket = socket;
        } else if (data.type === "pan-tilt-esp") {
          console.log("Pan-Tilt ESP connected");
          espPanTiltSocket = socket;
        } else if (data.type === "sensor-esp") {
          console.log("sensor ESP connected");
          espSensor = socket;
        } else if (data.type === "button-esp") {
          console.log("Button ESP connected");
          espButton = socket;
        } else if (data.type === "frontend") {
          console.log("Frontend connected");
          frontendSocket = socket;
        } else if (data.type === "control" && espSocket) {
          console.log(`Control code received: ${data.controlCode}`);
          try {
            espSocket.send(JSON.stringify({ controlCode: data.controlCode }));
          } catch (err) {
            console.error("Error sending control code:", err);
          }
        } else if (data.type === "pan-tilt" && espPanTiltSocket) {
          console.log(`Pan-Tilt code received: ${data.panTilt}`);
          try {
            espPanTiltSocket.send(JSON.stringify({ panTilt: data.panTilt }));
          } catch (err) {
            console.error("Error sending Pan-Tilt code:", err);
          }
        } else if (data.type === "set-pin" && espButton) {
          const { pin } = data;
          console.log(`Setting pin ${pin}`);
          // Send command to ESP
          espButton.send(JSON.stringify({ pin }));
          // Notify frontend of updated pin state
        } else if (data?.temperature && frontendSocket) {
          console.log("else");
          console.log(data);

          frontendSocket?.send(JSON.stringify({ type: "sensor", data: data }));
        }
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  socket.on("close", () => {
    if (socket === espSocket) {
      console.log("ESP module disconnected");
      espSocket = null;
    } else if (socket === frontendSocket) {
      console.log("Frontend disconnected");
      frontendSocket = null;
    } else if (socket === espPanTiltSocket) {
      console.log("Pan-Tilt ESP disconnected");
      espPanTiltSocket = null;
    } else if (socket === espButton) {
      console.log("Button ESP disconnected");
      espButton = null;
    }
  });

  socket.on("error", (err) => {
    console.error("Error with WebSocket:", err);
  });
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled promise rejection:", err);
});
