import WebSocket, { WebSocketServer } from "ws";

// Define the structure of client data
interface MessageData {
  type: "register" | "message";
  client?: string; // Unique identifier for the client
  target?: string; // Target client identifier
  message?: string; // Message content
}

// WebSocketServer instance
const wss = new WebSocketServer({ port: 8080 });

// Maintain a map of connected clients
const clients: Record<string, WebSocket> = {};

wss.on("connection", (ws: WebSocket) => {
  ws.on("message", (rawMessage: string) => {
    try {
      // Parse incoming message
      const data: MessageData = JSON.parse(rawMessage);

      // Handle registration
      if (data.type === "register" && data.client) {
        clients[data.client] = ws;
        console.log(`Client ${data.client} connected`);
        ws.send(JSON.stringify({ status: "registered", client: data.client }));
      }

      // Handle message relaying
      else if (
        data.type === "message" &&
        data.client &&
        data.target &&
        clients[data.target]
      ) {
        clients[data.target].send(
          JSON.stringify({ from: data.client, message: data.message })
        );
      }
    } catch (err) {
      console.error("Error parsing message:", err);
    }
  });

  ws.on("close", () => {
    // Remove the client from the map on disconnect
    for (const client in clients) {
      if (clients[client] === ws) {
        delete clients[client];
        console.log(`Client ${client} disconnected`);
      }
    }
  });
});

console.log("WebSocket relay server running on ws://localhost:8080");
