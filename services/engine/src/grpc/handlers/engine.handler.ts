import * as grpc from '@grpc/grpc-js';
import * as battleGrpc from '../generated/battle';
import * as engineGrpc from '../generated/engine';
import * as battleService from '../../services/battle.service';


export async function battleChannel(
  call: grpc.ServerDuplexStream<engineGrpc.BattleChannelClientEvent, battleGrpc.BattleObject>
) {
  try {
    // слушаем входящие события от Streaming
    call.on("data", async (event: engineGrpc.BattleChannelClientEvent) => {
      try {
        if (event.start) {
          const battle: battleGrpc.BattleObject = event.start.battle as battleGrpc.BattleObject;

          const updated = await battleService.battleNew(battle);
          if (updated) call.write(updated);

        }

        if (event.move) {

          const battleMoveRequest = event.move as engineGrpc.BattleMoveRequest;

          const updated = await battleService.makeMove(battleMoveRequest);

          if (updated) call.write(updated);
        }

        if (event.leave) {
          const updated = await battleService.leaveBattle(event.leave.profileId, event.leave.battleId);
          if (updated) call.write(updated);
        }

        if (event.ping) {
          // logger.info('Streaming-engine stream Ping');
          // heartbeat — можно просто игнорировать или логировать
        }
      } catch (err: any) {
        console.error("Event error:", err);
      }
    });

    call.on("end", () => {
      call.end();
    });

    call.on("error", (err) => {
      console.error("Stream error:", err);
      call.end();
    });
  } catch (err: any) {
    console.error("battleChannel error:", err);
    call.end();
  }
}
