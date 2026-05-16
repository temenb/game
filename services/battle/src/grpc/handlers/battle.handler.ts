import * as grpc from '@grpc/grpc-js';
import * as BattleGrpc from '../generated/battle';
import {
  BattleStatus as GrpcBattleStatus,
  BattleCellValue as GrpcBattleCellValue,
} from '../generated/battle';
import * as BattleService from '../../services/battle.service';
import {Battle, BattleStatus, BattleCellValue} from "@prisma/client";
import {callbackError} from './callback.error';
import logger from "@shared/logger";
import * as HealthGrpc from "../generated/common/health";


function toBattleStatus(status: BattleStatus): GrpcBattleStatus {
  switch (status) {
    case BattleStatus.Active: return GrpcBattleStatus.ACTIVE;
    case BattleStatus.Finished: return GrpcBattleStatus.FINISHED;
    default: throw new Error(`Unknown BattleStatus: ${status}`);
  }
}

function toBattleCellValue(cell: BattleCellValue): GrpcBattleCellValue {
  switch (cell) {
    case BattleCellValue.X: return GrpcBattleCellValue.CELL_X;
    case BattleCellValue.O: return GrpcBattleCellValue.CELL_O;
    case BattleCellValue.EMPTY: return GrpcBattleCellValue.CELL_EMPTY;
    default: throw new Error(`Unknown CellValue: ${cell}`);
  }
}

function convertBattleToGrpc(battle: Battle) {
  const grpcCells: GrpcBattleCellValue[] = (battle.cells).map(toBattleCellValue);
  const players: string[] = battle.players;

  return {
    id: battle.id,
    cells: grpcCells,
    players: players,
    status: toBattleStatus(battle.status),
    winner: battle.winner?? "",
    // createdAt: result.createdAt,
    // updatedAt: result.updatedAt,
  };
}

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

      callback(null, convertBattleToGrpc(battle));

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
    const result = await BattleService.getBattle(battleId);

    if (!result) {
      throw new Error("Battle not found");
    }

    callback(null, convertBattleToGrpc(result));

  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};


