import * as grpc from '@grpc/grpc-js';
import * as BattleGrpc from '../generated/battle';
import * as BattleService from '../../services/battle.service';
import {callbackError} from './callback.error';
import {battleToGrpc, battleToPrisma} from '../../lib/battle-grpc-prisma-converters';
import logger from "@shared/logger";
import {BattleModel} from "../../models/battle.model";


export async function upsertBattle(
  call: grpc.ServerUnaryCall<BattleGrpc.UpsertBattleRequest, BattleGrpc.BattleObject>,
  callback: grpc.sendUnaryData<BattleGrpc.BattleObject>
) {
    const {userId} = call.request;

    try {
      const battle = await BattleService.upsertBattle(userId);

      if (!battle) {
        throw new Error("Battle not found");
      }

      callback(null, battleToGrpc(battle));

    } catch (err: any) {
      logger.log(err);
      callbackError(callback, err);
    }
}

export const getBattle = async (
  call: grpc.ServerUnaryCall<BattleGrpc.BattleIdRequest, BattleGrpc.BattleObject>,
  callback: grpc.sendUnaryData<BattleGrpc.BattleObject>
) => {
  const {battleId} = call.request;

  try {
    const result = await BattleModel.getBattle(battleId);

    if (!result) {
      throw new Error("Battle not found");
    }

    callback(null, battleToGrpc(result));

  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};


