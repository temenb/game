import {WebSocketServer} from 'ws';
import * as streamingGrpc from "../grpc/generated/streaming";
import {battleHandler, isAllowedUser} from "./handlers/battle.handler";
import config from "../config/config";
import logger from "@shared/logger";
import extractUserIdFromJwt from "../lib/extractUserIdFromJwt";


export const wss = new WebSocketServer({port: config.webSocketPort});
logger.info(`WebSocket listening on ${config.webSocketPort}`);

export function initWss() {
  wss.on('connection', (ws, req) => {

    // logger.info('New websocket connection established');

    const url = new URL(req.url!, `http://${req.headers.host}`);
    let userId: string;
    let profileId: string;

    const token = url.searchParams.get('token');
    if (!token) {
      ws.close();
      logger.error("❌ Token is missing");
      return;
    }
    try {
      userId = extractUserIdFromJwt(token);
    } catch (e) {
      ws.close();
      logger.error("❌ JWT token is invalid")
      return;
    }

    profileId = url.searchParams.get('profileId')?? '';

    try {
      isAllowedUser(userId, profileId)
    } catch (e) {
      ws.close();
      logger.error("❌ JWT token does not match to profile")
      return;
    }

    ws.on('message', (data) => {
      // logger.log('📩 Raw message:', data);
      try {
        const buffer = new Uint8Array(data as ArrayBuffer);
        const request = streamingGrpc.BattleStreamRequest.decode(buffer);

        try {
          if (url.pathname.startsWith('/battle')) {
            battleHandler(ws, profileId, request);
          } else {
            logger.warn(`⚠️ Unknown path: ${url.pathname}`);
          }
        } catch (err) {
          logger.error('❌ Message handling error:', err);
        }

      } catch (err) {
        logger.error('❌ JSON parse error:', err);
      }
    });


    // // широковещательная рассылка всем клиентам
    // wss.clients.forEach((client) => {
    //   if (client.readyState === ws.OPEN) {
    //     client.send(JSON.stringify(msg));
    //   }
    // });

    ws.on('close', () => {
      // logger.log('❌ Client is disconnected');
    });

  });
}

logger.log('WebSocket server is started at ws://localhost:8080');

export default wss;
