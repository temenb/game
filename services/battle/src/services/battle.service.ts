import {prisma} from '../lib/prisma';
import { Battle } from "@prisma/client";
import {createProducer} from '@shared/kafka';
import kafkaConfig, {createBattleProducerConfig} from "../config/kafka.config";

export async function getBattle(battleId: string): Promise<Battle | null> {
  const battle = await prisma.battle.findUnique({
    where: { id: battleId }
  });

  return battle;
}


