import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  ws.send(JSON.stringify({ type: 'register', client: 'a' }));
  console.log('Client-A connected to Server-C');

  // Send a message to Client-B via Server-C
  setTimeout(() => {
    ws.send(JSON.stringify({ type: 'message', client: 'a', target: 'b', message: 'Hello from Client-A!' }));
  }, 1000);
});

ws.on('message', (data) => {
  console.log('Message from Server-C:', data.toString());
});