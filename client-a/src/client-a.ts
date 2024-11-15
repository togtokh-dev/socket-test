import WebSocket from "ws";

// Define the structure of messages sent to the server
interface RegisterMessage {
  type: "register";
  client: string; // Identifier for the client (e.g., 'a', 'b')
}

interface OutgoingMessage {
  type: "message";
  client: string; // Sender's identifier
  target: string; // Target client identifier
  message: string; // Message content
}

// Define the structure of messages received from the server
interface IncomingMessage {
  from: string; // Sender's identifier
  message: string; // Message content
}

const ws = new WebSocket("ws://localhost:8080");

ws.on("open", () => {
  // Register the client with the server
  const registerMessage: RegisterMessage = { type: "register", client: "a" };
  ws.send(JSON.stringify(registerMessage));
  console.log("Client-A connected to Server-C");

  // Send a message to Client-B via Server-C
  setTimeout(() => {
    console.log("object");
    const outgoingMessage: OutgoingMessage = {
      type: "message",
      client: "a",
      target: "b",
      message: "Hello from Client-A!",
    };
    ws.send(JSON.stringify(outgoingMessage));
  }, 1000);
});

ws.on("message", (data: WebSocket.RawData) => {
  try {
    // Parse the incoming message and type it
    const message: IncomingMessage = JSON.parse(data.toString());
    console.log("Message from Server-C:", message);
  } catch (err) {
    console.error("Error parsing message:", err);
  }
});
