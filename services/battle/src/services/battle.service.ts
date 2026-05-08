import {prisma} from '../lib/prisma';
import {Battle} from "@prisma/client";

export async function getBattle(battleId: string): Promise<Battle | null> {
  const battle = await prisma.battle.findUnique({
    where: {id: battleId}
  });

  return battle;
}

export async function createBattle(battleId: string): Promise<Battle | null> {
  const battle = await prisma.battle.findUnique({
    where: {id: battleId}
  });

  return battle;
}

export async function updateBattle(battleId: string): Promise<Battle | null> {
  const battle = await prisma.battle.findUnique({
    where: {id: battleId}
  });

  return battle;
}
