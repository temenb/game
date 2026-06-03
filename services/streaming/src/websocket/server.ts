import { WebSocketServer, WebSocket} from 'ws';
import {BattleStreamRequest} from "../grpc/generated/streaming";
import {battleHandler} from "./handlers/battle.handler";
import jwt from "jsonwebtoken";
import config from "../config/config";
import logger from "@shared/logger";


export const wss = new WebSocketServer({ port: config.webSocketPort });
logger.info(`WebSocket listening on ${config.webSocketPort}`);

export function initWss() {
  wss.on('connection', (ws, req) => {

    const url = new URL(req.url!, `http://${req.headers.host}`);
    const token = url.searchParams.get('token');

    if (!token) {
      logger.error("❌ Token is missing");
      ws.close();
      return;
    }

    let userId: string;
    try {
      const payload = jwt.verify(token, config.jwtAccessSecret);
      userId = String(payload.sub);
      logger.log("✅ Authorized:", userId);
    } catch (err) {
      logger.error("❌ JWT token is invalid");
      ws.close();
    }

    ws.on('message', (data) => {
      logger.log('📩 Raw message:', data);
      try {
        const buffer = new Uint8Array(data as ArrayBuffer);
        const request = BattleStreamRequest.decode(buffer);

        try {
          if (url.pathname.startsWith('/battle')) {
            battleHandler(ws, userId, request);
          } else {
            logger.warn(`⚠️ Unknown path: ${url.pathname}`);
          }
        } catch (err) {
          logger.error('❌ Message handling error:', err);
        }


      } catch (err) {
        logger.error('❌ JSON parse error:', err);
      }

      ws.on('close', () => {
        logger.log('❌ Client is disconnected');
      });


      // // широковещательная рассылка всем клиентам
      // wss.clients.forEach((client) => {
      //   if (client.readyState === ws.OPEN) {
      //     client.send(JSON.stringify(msg));
      //   }
      // });
    });
  });
}

logger.log('WebSocket server is started at ws://localhost:8080');

export default wss;
