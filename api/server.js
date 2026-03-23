import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws'; 

const app = express();
const port = 3000;
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');

  ws.on('message', (message) => {
    console.log('Received from client:', message.toString());
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});