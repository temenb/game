import * as streamingGrpc from "../grpc/generated/streaming";
import * as streamingWs from "../websoket/clients/streaming.client";

export const connectToBattle = async (battleId: string) => {

  streamingWs.join(battleId);
  const ws = await streamingWs.getWebSocket();
  // гарантируем, что профиль загружен
  const profile = await streamingWs.getProfile();

  const req = streamingGrpc.BattleStreamRequest.create({
    join: {battleId, profileId: profile.id}
  });

  const buffer = streamingGrpc.BattleStreamRequest.encode(req).finish();
  ws.send(buffer);
};
