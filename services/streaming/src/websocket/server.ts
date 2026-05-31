import { WebSocketServer, WebSocket} from 'ws';
import {BattleStreamRequest} from "../grpc/generated/streaming";
import {battleHandler} from "./handlers/battle.handler";
import jwt from "jsonwebtoken";
import config from "../config/config";
import logger from "@shared/logger";


type ServerMessage =
  | { type: 'battle'; payload: BattleStreamRequest };

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
      logger.log(data);
      try {
        const message: ServerMessage = JSON.parse(data.toString());

        switch (message.type) {
          case 'battle':
            logger.log(message);
            battleHandler(ws, userId, message.payload);
            break;
        }

        //
        // const msg: BattleMessage = JSON.parse(data.toString());
        // logger.log('📩 Message:', msg);
        //
        // if (msg.type === 'join') {
        //   // логика подключения игрока
        //   ws.send(JSON.stringify({ type: 'joined', battleId: msg.battleId, userId: msg.userId }));
        // }
        //
        // if (msg.type === 'move') {
        //   // логика хода
        //   ws.send(JSON.stringify({ type: 'moved', battleId: msg.battleId, userId: msg.userId, cellIdx: msg.cellIdx }));
        // }
        //
        // // широковещательная рассылка всем клиентам
        // wss.clients.forEach((client) => {
        //   if (client.readyState === ws.OPEN) {
        //     client.send(JSON.stringify(msg));
        //   }
        // });
      } catch (err) {
        logger.error('❌ Message handling error:', err);
      }
    });

    ws.on('close', () => {
      logger.log('❌ Client is disconnected');
    });
  });
}

logger.log('WebSocket server is started at ws://localhost:8080');

export default wss;
