import * as grpc from '@grpc/grpc-js';
import * as BattleGrpc from '../generated/battle';
import {CellValue as GrpcCellValue} from '../generated/battle';
import * as BattleService from '../../services/battle.service';
import {callbackError} from './callback.error';
import logger from "@shared/logger";

export const getBattle = async (
  call: grpc.ServerUnaryCall<BattleGrpc.GetBattleRequest, BattleGrpc.BattleObject>,
  callback: grpc.sendUnaryData<BattleGrpc.BattleObject>
) => {
  const {battleId} = call.request;

  try {
    const result = await BattleService.getBattle(battleId);

    if (!result) {
      throw new Error("Battle not found");
    }

    const grpcCells: GrpcCellValue[] = (result.cells as string[]).map(toGrpcCellValue);

    callback(null, {
      id: result.id,
      cells: grpcCells,
      // createdAt: result.createdAt,
      // updatedAt: result.updatedAt,
    });

  } catch (err: any) {
    logger.log(err);
    callbackError(callback, err);
  }
};

function toGrpcCellValue(c: string): GrpcCellValue {
  switch (c) {
    case "X": return GrpcCellValue.CELL_X;
    case "O": return GrpcCellValue.CELL_O;
    case "EMPTY": return GrpcCellValue.CELL_EMPTY;
    default: throw new Error(`Unknown CellValue: ${c}`);
  }
}


