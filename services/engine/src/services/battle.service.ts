import {kafkaProducersConfig} from "../config/kafka.config";
import {StoreRegistry, stores} from "./store-registry";
import {BattleCellValue, BattleObject, BattleStatus} from "../grpc/generated/battle";
import {BattleMoveRequest} from "../grpc/generated/engine";
import {BattleStateStore} from "../stores/battleStateStore";
import {enqueueEvent} from "@shared/pg-boss/src/enqueueEvent";
import logger from "@shared/logger";

export function battleStore(): BattleStateStore {
  // убедимся, что сторы инициализированы
  const battleStore = StoreRegistry.getStore<BattleStateStore>(stores.BattleStateStore.key);

  if (!battleStore) {
    throw new Error("BattleStateStore not found");
  }

  return battleStore;
}

export const battleNew = async (battle: BattleObject) => {
  logger.log('New battle started', battle)
  battle.cells = Array(9).fill(BattleCellValue.CELL_EMPTY);
  battle.status = BattleStatus.ACTIVE;
  battle.winner = "";

  await battleStore().set(battle);
  await enqueueEvent(kafkaProducersConfig.topicBattleUpdated, battle);

};

function getSymbolForUser(battle: BattleObject, move: BattleMoveRequest): BattleCellValue {
  const idx = battle.players.indexOf(move.userId);
  if (idx === -1) throw new Error("User is not found in the battle");

  return idx === 0 ? BattleCellValue.CELL_X : BattleCellValue.CELL_O;
}

function verifyTurn(battle: BattleObject, move: BattleMoveRequest) {
  if (move.userId != battle.players[turn(battle)]) {
    throw new Error(`Not your turn`);
  }
}

function turn(battle: BattleObject) {
  return battle.cells.filter(
    cell => cell !== BattleCellValue.CELL_EMPTY
  ).length % battle.players.length;
}

function verifyCell(battle: BattleObject, move: BattleMoveRequest) {
  if (battle.cells[move.cellIdx] != BattleCellValue.CELL_EMPTY) {
    throw new Error(`Cell is not empty`);
  }
}

function isWin(battle: BattleObject): boolean {
  const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  for (const [a,b,c] of winningCombos) {
    if (
      battle.cells[a] !== BattleCellValue.CELL_EMPTY &&
      battle.cells[a] === battle.cells[b] &&
      battle.cells[a] === battle.cells[c]
    ) {
      return true;
    }
  }
  return false;
}

function isDraw(battle: BattleObject): boolean {
  return !battle.cells.includes(BattleCellValue.CELL_EMPTY);
}

export const makeMove = async (move: BattleMoveRequest) => {
  const battle = await battleStore().get(move.battleId);

  if (!battle) {
    throw new Error(`Battle ${move.battleId} not found`);
  }

  verifyTurn(battle, move);
  verifyCell(battle, move);

  battle.cells[move.cellIdx] = getSymbolForUser(battle, move);

  if (isWin(battle) || isDraw(battle)) {
    battle.status = BattleStatus.FINISHED;
    if (isWin(battle)) {
      battle.winner = move.userId;
    }
  }

  if (battle.status == BattleStatus.FINISHED) {
    await battleStore().remove(battle.id);
  } else {
    await battleStore().set(battle);
  }

  await enqueueEvent(kafkaProducersConfig.topicBattleUpdated, battle);
};
