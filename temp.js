



// const express = require("express");
// const WebSocket = require("ws");
// const cors = require("cors");

// // Create an Express app
// const app = express();
// app.use(cors());
// app.use(express.json());

// // WebSocket server
// const wss = new WebSocket.Server({ port: 5800, host: "0.0.0.0" });
// const espCamWss = new WebSocket.Server({ port: 5900, host: "0.0.0.0" });
// let espSocket = null; // Track the ESP module's connection
// let espCamSocket = null; // Track the ESP module's connection
// let espPanTiltSocket = null; // Track the ESP module's connection
// let espButton = null; // Track the ESP module's connection
// let frontendSocket = null; // Track the frontend connection

// espCamWss.on("connection", (socket) => {
//   console.log("New ESP32 WebSocket connection");

//   socket.on("message", (message) => {
//     // Forward the message (like image data) to all connected clients
//     espCamWss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         try {
//           client.send(message); // Forward the image data
//         } catch (err) {
//           console.error("Error sending message to ESP-CAM clients:", err);
//         }
//       }
//     });
//   });

//   socket.on("close", () => {
//     console.log("ESP-cam module disconnected");
//   });

//   socket.on("error", (err) => {
//     console.error("Error with ESP-cam socket:", err);
//   });
// });

// wss.on("connection", (socket, req) => {
//   console.log("New WebSocket connection");

//   socket.on("message", async (message) => {
//     try {
//       const data = JSON.parse(message);
//       if (data) {
//         if (data.type === "esp") {
//           console.log("ESP module connected");
//           espSocket = socket;
//         } else if (data.type === "pan-tilt-esp") {
//           console.log("pan-tilt-esp connected");
//           espPanTiltSocket = socket;
//         } else if (data.type === "button-esp") {
//           console.log("button-esp connected");
//           espButton = socket;
//         } else if (data.type === "frontend") {
//           console.log("Frontend connected");
//           frontendSocket = socket;
//         } else if (data.type === "esp-cam") {
//           console.log("esp-cam connected");
//           espCamSocket = socket;
//         } else if (data.type === "control" && espSocket) {
//           // Handle control concurrently
//           console.log(`Control code received: ${data.controlCode}`);
//           try {
//             espSocket.send(JSON.stringify({ controlCode: data.controlCode }));
//           } catch (err) {
//             console.error("Error sending control code:", err);
//           }
//         } else if (data.type === "pan-tilt" && espPanTiltSocket) {
//           // Handle pan-tilt concurrently
//           console.log(`Pan-tilt code received: ${data.panTilt}`);
//           try {
//             espPanTiltSocket.send(JSON.stringify({ panTilt: data.panTilt }));
//           } catch (err) {
//             console.error("Error sending pan-tilt code:", err);
//           }
//         } else if (data.type === "dummy" && frontendSocket) {
//           console.log(`Dummy data received: ${data.payload}`);
//           try {
//             frontendSocket.send(JSON.stringify({ type: "dummy", payload: data.payload }));
//           } catch (err) {
//             console.error("Error sending dummy data:", err);
//           }
//         } else {
//           console.log(data);
//         }
//       }
//     } catch (err) {
//       console.error("Error processing message:", err);
//     }
//   });

//   // Handle disconnection
//   socket.on("close", () => {
//     if (socket === espSocket) {
//       console.log("ESP module disconnected");
//       espSocket = null;
//     } else if (socket === frontendSocket) {
//       console.log("Frontend disconnected");
//       frontendSocket = null;
//     } else if (socket === espPanTiltSocket) {
//       console.log("Pan-tilt ESP disconnected");
//       espPanTiltSocket = null;
//     }
//   });

//   // Handle socket errors
//   socket.on("error", (err) => {
//     console.error("Error with WebSocket:", err);
//   });
// });

// process.on("uncaughtException", (err) => {
//   console.error("Uncaught exception:", err);
//   // Optionally, you can send a notification or restart the server in case of critical errors
// });

// process.on("unhandledRejection", (err) => {
//   console.error("Unhandled promise rejection:", err);
//   // Optionally, you can send a notification or restart the server in case of critical errors
// });













// const express = require("express");
// const WebSocket = require("ws");
// const cors = require("cors");

// // Create an Express app
// const app = express();
// app.use(cors());
// app.use(express.json());

// // WebSocket server
// const wss = new WebSocket.Server({ port: 5800, host: "0.0.0.0" });
// const espCamWss = new WebSocket.Server({ port: 5900, host: "0.0.0.0" });
// let espSocket = null; // Track the ESP module's connection
// let espCamSocket = null; // Track the ESP module's connection
// let espPanTiltSocket = null; // Track the ESP module's connection
// let frontendSocket = null; // Track the frontend connection

// espCamWss.on("connection", (socket) => {
//   console.log("New ESP32 WebSocket connection");

//   socket.on("message", (message) => {

//     espCamWss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message); // Forward the image data
//       }
//     });
//   });
//   socket.on("close", () => {
//     console.log("ESP-cam module disconnected");
//   });
// });

// wss.on("connection", (socket, req) => {
//   console.log("New WebSocket connection");

//   // Assign connection roles based on a query parameter
//   socket.on("message", (message) => {
//     // console.log(message)
//     try {
//       const data = JSON.parse(message);
//       if (data) {
//         if (data.type === "esp") {
//           console.log("ESP module connected");
//           espSocket = socket;
//         } else if (data.type === "pan-tilt-esp") {
//           console.log("pan-tilt-esp connected");
//           espPanTiltSocket = socket;
//         } else if (data.type === "frontend") {
//           console.log("Frontend connected");
//           frontendSocket = socket;
//         } else if (data.type === "esp-cam") {
//           console.log("esp-cam connected");
//           espCamSocket = socket;
//         } else if (data.type === "control" && espSocket) {
//           console.log(`Control code received: ${data.controlCode}`);
//           espSocket.send(JSON.stringify({ controlCode: data.controlCode }));
//         } else if (data.type === "pan-tilt" && espPanTiltSocket) {
//           console.log(`pan-tilt code received: ${data.panTilt}`);
//           espPanTiltSocket.send(JSON.stringify({ panTilt: data.panTilt }));
//         } else if (data.type === "dummy" && frontendSocket) {
//           console.log(`dummy data received: ${data.payload}`);
//           frontendSocket.send(
//             JSON.stringify({ type: "dummy", payload: data.payload })
//           );
//         }else{
//           console.log(data)
//         }
//       }
//     } catch (err) {
//       console.error("Error processing message:", err);
//       // frontendSocket.send(message);
//     }
//   });

//   // Handle disconnection
//   socket.on("close", () => {
//     if (socket === espSocket) {
//       console.log("ESP module disconnected");
//       espSocket = null;
//     } else if (socket === frontendSocket) {
//       console.log("Frontend disconnected");
//       frontendSocket = null;
//     }
//   });
// });

// // Endpoint to check server health
// app.get("/", (req, res) => res.send("WebSocket server running!"));

// // Start the HTTP server
// const PORT = 5000;
// app.listen(PORT, () => console.log(`HTTP server running on port ${PORT}`));
