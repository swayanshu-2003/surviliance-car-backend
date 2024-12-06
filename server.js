const express = require("express");
const WebSocket = require("ws");
const cors = require("cors");
const app = express();
const PORT = 5800;
app.use(cors());
// Serve the frontend
app.use(express.static("public"));

// Create a WebSocket server
const wss = new WebSocket.Server({ noServer: true });
app.get("/", (req, res) => {
  return res.send("welcome");
});
wss.on("connection", (ws) => {
  console.log("WebSocket client connected");

  // Broadcast incoming image data to all clients
  ws.on("message", (data) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data); // Forward the image data
      }
    });
  });

  ws.on("close", () => {
    console.log("WebSocket client disconnected");
  });
});

// Handle WebSocket upgrade requests
const server = app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

// const express = require("express");
// const multer = require("multer");
// const path = require("path");
// const cors = require('cors')

// const app = express();
// const PORT = 5800;
// app.use(cors())
// // Configure multer for in-memory file handling
// const storage = multer.memoryStorage(); // Do not store files on disk
// const upload = multer({ storage });

// // Stream connections
// const clients = [];

// // Route to handle SSE connections
// app.get("/stream", (req, res) => {
//   res.setHeader("Content-Type", "text/event-stream");
//   res.setHeader("Cache-Control", "no-cache");
//   res.setHeader("Connection", "keep-alive");

//   // Add client to the list
//   clients.push(res);

//   // Remove client when connection is closed
//   req.on("close", () => {
//     const index = clients.indexOf(res);
//     if (index !== -1) clients.splice(index, 1);
//   });
// });

// // Route to handle image uploads
// app.post("/upload", upload.single("image"), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded");
//   }

//   console.log("Image received");

//   // Broadcast image to all clients
//   const base64Image = req.file.buffer.toString("base64");
//   const imageData = `data:image/jpeg;base64,${base64Image}`;
//   clients.forEach((client) => {
//     client.write(`data: ${imageData}\n\n`);
//   });

//   res.status(200).send({ message: "Image streamed successfully" });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://0.0.0.0:${PORT}`);
// });
