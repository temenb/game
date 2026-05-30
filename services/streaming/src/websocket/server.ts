import { WebSocketServer } from 'ws';
import {BattleStreamRequest} from "../grpc/generated/streaming";
import {battleHandler} from "./handlers/battle.handler";
import jwt from "jsonwebtoken";
import config from "../config/config";


type ServerMessage =
  | { type: 'battle'; payload: BattleStreamRequest };

const wss = new WebSocketServer({ port: config.webSocketPort });

wss.on('connection', (ws, req) => {

  const url = new URL(req.url!, `http://${req.headers.host}`);
  const token = url.searchParams.get('token');

  try {
    const jwtPayload = jwt.verify(token, config.jwtAccessSecret);
    (ws as any).user = payload;
    console.log("✅ Authorized:", payload.sub);
  } catch (err) {
    console.error("❌ JWT token is invalid");
    ws.close();
  }

  console.log('🔗 New client connected');

  ws.on('message', (data) => {
    try {
      const message: ServerMessage = JSON.parse(data.toString());

      switch (message.type) {
        case 'battle':
          battleHandler(ws, message.payload);
          break;
      }

      //
      // const msg: BattleMessage = JSON.parse(data.toString());
      // console.log('📩 Получено сообщение:', msg);
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
      console.error('❌ Ошибка обработки сообщения:', err);
    }
  });

  ws.on('close', () => {
    console.log('❌ Клиент отключился');
  });
});

console.log('🟢====================================================================== WebSocket сервер запущен на ws://localhost:8080');

export default wss;
