import { PrismaClient } from '@prisma/client';
import {createSpawnProducerConfig, kafkaConfig} from "../config/kafka.config";
import { createProducer } from '@shared/kafka';

const prisma = new PrismaClient();

export async function findSpawn(ownerId: string) {
  return prisma.spawner.findFirst({ where: { ownerId } });
}


export async function upsertSpawn(ownerId: string) {

  const existing = await prisma.spawner.findFirst({ where: { ownerId } });

  if (existing) {
    return existing;
  }

  const spawner = await prisma.spawner.create({
    data: {
      ownerId: ownerId,
      galaxyId: 'galaxy-456',
      spawnType: 'BASE',
      ownerType: 'PLAYER',
      resourceType: 'IRON',
      spawnGrade: 'EPIC',
      axisX: 42,
      axisY: 17,
      health: 100,
      // name: 'Zeta-9',
    },
  });



  const producer = await createProducer(kafkaConfig);
  producer.send(createSpawnProducerConfig, [{ value: JSON.stringify({ id: spawner.id }) }]);

  return spawner;
}
