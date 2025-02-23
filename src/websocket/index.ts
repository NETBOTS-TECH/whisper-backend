import WebSocket from "ws";

export function handleWebSocketConnection(ws: WebSocket) {
  console.log("New WebSocket connection");
  ws.on("message", (data) => {
    console.log("Received:", data.toString());
  });
  ws.on("close", () => {
    console.log("WebSocket closed");
  });
  ws.on("error", (err) => {
    console.error("WebSocket error:", err);
  });
}
