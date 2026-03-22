import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws'; 

const app = express();
const port = 3000;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');

  const interval = setInterval(() => {
    ws.send(JSON.stringify({
      msg: 'Server heartbeat',
      time: new Date()
    }));
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
  console.log(`Server running on http://localhost:${port}`);
});