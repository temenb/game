import { kafkaProducersConfig } from "../config/kafka.config";
import { enqueueEventTx } from "../lib/pgBoss";
import {StoreRegistry, stores} from "./store-registry";
import {BattleCellValue, BattleObject, BattleStatus} from "../grpc/generated/battle";
import {BattleMoveRequest} from "../grpc/generated/engine";
import {BattleStateStore} from "../stores/battleStateStore";
import logger from '@shared/logger';

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

  battleStore().set(battle);

  await enqueueEventTx(kafkaProducersConfig.topicBattleUpdated, battle);

};

function getSymbolForUser(battle: BattleObject, userId: string): BattleCellValue {
  const idx = battle.players.indexOf(userId);
  if (idx === -1) throw new Error("Игрок не найден в баттле");

  return idx === 0 ? BattleCellValue.CELL_X : BattleCellValue.CELL_O;
}


export const battleUpdated = async (move: BattleMoveRequest) => {

  const battle = battleStore().get(move.battleId);

  if (!battle) {
    throw new Error(`Battle ${move.battleId} not found`);
  }

  // battleId
  // userId
  // cellIndex

  //тут будет вызываться логика крестиков ноликов, производиться расчеты и герерироваться новые значения поля
  // событие обновления состояния баттла


  await enqueueEventTx(kafkaProducersConfig.topicBattleUpdated, battle);
};
