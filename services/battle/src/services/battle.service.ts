import {Battle, BattleStatus} from "@prisma/client";
import {BattleModel} from "../models/battle.model";

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundError';
  }
}

export async function upsertBattle(userId: string): Promise<Battle> {
  const existingMyBattle = await BattleModel.findBattleByUser(userId);

  if (existingMyBattle) {
    return existingMyBattle;
  }

  let attempts = 3;

  while (attempts > 0) {
    const existingSomebodiesBattle = await BattleModel.findAvailableBattle(userId);

    if (existingSomebodiesBattle) {
      const joined = await BattleModel.joinBattle(existingSomebodiesBattle.id, userId);
      if (joined) {
        return joined;
      }
      attempts--;
      continue;
    }


    return BattleModel.createBattle(userId);
  }

  return BattleModel.createBattle(userId);
}

