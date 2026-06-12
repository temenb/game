import * as streamingGrpc from '../../grpc/generated/streaming';
import * as battleGrpc from '../../grpc/generated/streaming';
import WebSocket from "ws";

export const messageHandler = (data: battleGrpc.BattleStreamResponse) => {
  try {
    const buffer = new Uint8Array(data as ArrayBuffer);
    const response = streamingGrpc.BattleStreamResponse.decode(buffer);
    console.log("📩 Got response:", response);
    // здесь можно вызвать обработчик, например updateUI(response)
  } catch (err) {
    console.error("❌ Failed to parse message:", err);
  }
}

export const errorHandler = (err: unknown) => {
  console.error("⚠️ WebSocket error:", err);
}

export const closeHandler = () => {
  console.log("❌ Connection closed");
  // можно реализовать reconnect()
}
