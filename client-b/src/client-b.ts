import WebSocket from "ws";

// Define the structure of messages to/from the WebSocket server
interface RegisterMessage {
  type: "register";
  client: string; // Identifier for the client (e.g., 'a', 'b')
}

interface RelayMessage {
  type: "message";
  from: string; // Sender's identifier
  message: string; // Message content
}

type IncomingMessage = RelayMessage;

// Create a WebSocket connection to the server
const ws = new WebSocket("ws://10.21.67.120:8080");

ws.on("open", () => {
  // Register the client with the server
  const registerMessage: RegisterMessage = { type: "register", client: "b" };
  ws.send(JSON.stringify(registerMessage));
  console.log("Client-B connected to Server-C");
});

ws.on("message", (data: WebSocket.RawData) => {
  try {
    // Parse and typecast the incoming message
    const message: IncomingMessage = JSON.parse(data.toString());
    if (message.from === "a") {
      console.log("Message from Client-A:", message.message);
    }
  } catch (err) {
    console.error("Error parsing message:", err);
  }
});
