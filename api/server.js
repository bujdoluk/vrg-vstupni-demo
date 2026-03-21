const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const port = 3000;

// Optional: serve static frontend
app.use(express.static('../dist')); // adjust if you deploy frontend separately

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Handle WebSocket connections
wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');

  // Send a welcome message every 5s
  const interval = setInterval(() => {
    ws.send(JSON.stringify({ msg: 'Server heartbeat', time: new Date() }));
  }, 5000);

  ws.on('message', (message) => {
    console.log('Received from client:', message.toString());
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });
});

server.listen(port, () => {
  console.log(`Backend WebSocket server listening on http://localhost:${port}`);
});