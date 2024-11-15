import WebSocket from 'ws';

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
  ws.send(JSON.stringify({ type: 'register', client: 'b' }));
  console.log('Client-B connected to Server-C');
});

ws.on('message', (data) => {
  const message = JSON.parse(data.toString());
  if (message.from === 'a') {
    console.log('Message from Client-A:', message.message);
  }
});