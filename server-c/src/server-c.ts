import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });
const clients: { [key: string]: WebSocket } = {};

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    const data = JSON.parse(message.toString());
    if (data.type === 'register') {
      clients[data.client] = ws;
      console.log(`Client ${data.client} connected`);
      ws.send(JSON.stringify({ status: 'registered', client: data.client }));
    } else if (data.type === 'message' && clients[data.target]) {
      clients[data.target].send(JSON.stringify({ from: data.client, message: data.message }));
    }
  });

  ws.on('close', () => {
    for (const client in clients) {
      if (clients[client] === ws) {
        delete clients[client];
        console.log(`Client ${client} disconnected`);
      }
    }
  });
});

console.log('WebSocket relay server running on ws://localhost:8080');