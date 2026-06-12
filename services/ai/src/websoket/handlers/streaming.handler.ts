import * as streamingGrpc from '../../grpc/generated/streaming';
import * as battleGrpc from '../../grpc/generated/streaming';
import WebSocket from "ws";

export const initHandlers = async (ws: WebSocket) => {
  ws.on("open", () => {
    console.log("✅ Connected to AI service");
  });

  ws.on("message", (data) => {
    try {
      const buffer = new Uint8Array(data as ArrayBuffer);
      const response = streamingGrpc.BattleStreamResponse.decode(buffer);
      console.log("📩 Got response:", response);
      // здесь можно вызвать обработчик, например updateUI(response)
    } catch (err) {
      console.error("❌ Failed to parse message:", err);
    }
  });

  ws.on("error", (err) => {
    console.error("⚠️ WebSocket error:", err);
  });

  ws.on("close", () => {
    console.log("❌ Connection closed");
    // можно реализовать reconnect()
  });
};

