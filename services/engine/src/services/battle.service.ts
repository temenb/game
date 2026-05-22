import {kafkaConfig, kafkaProducersConfig} from "../config/kafka.config";
import {StoreRegistry, stores} from "./store-registry";
import {BattleCellValue, BattleObject, BattleStatus} from "../grpc/generated/battle";
import {BattleMoveRequest} from "../grpc/generated/engine";
import {BattleStateStore} from "../stores/battleStateStore";
import {enqueueEvent} from "@shared/pg-boss/src/enqueueEvent";
import logger from "@shared/logger";
import {pgBossKafkaEventPrefix} from "@shared/pg-boss";
import {createProducer} from "@shared/kafka";
// import logger from "@shared/logger";
// import {boss, pgBossKafkaEventPrefix} from "@shared/pg-boss";

export function battleStore(): BattleStateStore {
  // убедимся, что сторы инициализированы
  const battleStore = StoreRegistry.getStore<BattleStateStore>(stores.BattleStateStore.key);

  if (!battleStore) {
    throw new Error("BattleStateStore not found");
  }

  return battleStore;
}

export const battleNew = async (battleId: string, players: string[]) => {

  const battle: BattleObject = {
    id: battleId,
    cells: Array(9).fill(BattleCellValue.CELL_EMPTY),
    players,
    status: BattleStatus.ACTIVE,
    winner: "",
    // createdAt: new Date().toISOString(),
    // updatedAt: new Date().toISOString(),
  };

  await battleStore().set(battle);

  // try {
  //
  //   logger.log('boss().work()!!!!!!!!!!!!!!!!!')
  //   const producer = await createProducer(kafkaConfig);
  //
  //   await producer.send(kafkaProducersConfig.topicBattleUpdated, battle);
  //   logger.log('pgBoss ' + kafkaProducersConfig.topicBattleUpdated + ' event successfully done');
  //
  //   return true;
  // } catch (err) {
  //   logger.error('Kafka send failed:', err);
  //   throw err;
  // }

  await enqueueEvent(kafkaProducersConfig.topicBattleUpdated, battle);

};

function getSymbolForUser(battle: BattleObject, move: BattleMoveRequest): BattleCellValue {
  const idx = battle.players.indexOf(move.userId);
  if (idx === -1) throw new Error("Игрок не найден в баттле");

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
  // Проверяем победные комбинации
  const winningCombos = [
    [0,1,2],[3,4,5],[6,7,8], // строки
    [0,3,6],[1,4,7],[2,5,8], // столбцы
    [0,4,8],[2,4,6]          // диагонали
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