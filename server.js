const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");

// Create an Express app
const app = express();
app.use(cors());
app.use(express.json());

// WebSocket server
const wss = new WebSocket.Server({ port: 5800, host: "0.0.0.0" });
const espCamWss = new WebSocket.Server({ port: 5900, host: "0.0.0.0" });
let espSocket = null; // Track the ESP module's connection
let frontendSocket = null; // Track the frontend connection

espCamWss.on("connection", (socket) => {
  console.log("New ESP32 WebSocket connection");

  socket.on("message", (message) => {

    espCamWss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message); // Forward the image data
      }
    });
  });
  socket.on("close", () => {
    console.log("ESP-cam module disconnected");
  });
});

wss.on("connection", (socket, req) => {
  console.log("New WebSocket connection");

  // Assign connection roles based on a query parameter
  socket.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      if (data) {
        if (data.type === "esp") {
          console.log("ESP module connected");
          espSocket = socket;
        } else if (data.type === "frontend") {
          console.log("Frontend connected");
          frontendSocket = socket;
        } else if (data.type === "control" && espSocket) {
          console.log(`Control code received: ${data.controlCode}`);
          espSocket.send(JSON.stringify({ controlCode: data.controlCode }));
        } else if (data.type === "dummy" && frontendSocket) {
          console.log(`dummy data received: ${data.payload}`);
          frontendSocket.send(
            JSON.stringify({ type: "dummy", payload: data.payload })
          );
        }
      }
    } catch (err) {
      console.error("Error processing message:", err);
      // frontendSocket.send(message);
    }
  });

  // Handle disconnection
  socket.on("close", () => {
    if (socket === espSocket) {
      console.log("ESP module disconnected");
      espSocket = null;
    } else if (socket === frontendSocket) {
      console.log("Frontend disconnected");
      frontendSocket = null;
    }
  });
});

// Endpoint to check server health
app.get("/", (req, res) => res.send("WebSocket server running!"));

// Start the HTTP server
const PORT = 5000;
app.listen(PORT, () => console.log(`HTTP server running on port ${PORT}`));

// const express = require("express");
// const WebSocket = require("ws");
// const cors = require("cors");
// const app = express();
// const PORT = 5800;
// app.use(cors());
// // Serve the frontend
// app.use(express.static("public"));

// // Create a WebSocket server
// const wss = new WebSocket.Server({ noServer: true });
// app.get("/", (req, res) => {
//   return res.send("welcome");
// });
// wss.on("connection", (ws) => {
//   console.log("WebSocket client connected");

//   // Broadcast incoming image data to all clients
//   ws.on("message", (data) => {
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(data); // Forward the image data
//       }
//     });
//   });

//   ws.on("close", () => {
//     console.log("WebSocket client disconnected");
//   });
// });

// // Handle WebSocket upgrade requests
// const server = app.listen(PORT, () => {
//   console.log(`Server running at http://localhost:${PORT}`);
// });

// server.on("upgrade", (request, socket, head) => {
//   wss.handleUpgrade(request, socket, head, (ws) => {
//     wss.emit("connection", ws, request);
//   });
// });
