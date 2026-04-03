import { PrismaClient } from '@prisma/client';
import {createSpawnerProducerConfig, kafkaConfig} from "../config/kafka.config";
import { createProducer } from '@shared/kafka';

const prisma = new PrismaClient();

export async function findSpawner(ownerId: string) {
  return prisma.spawner.findFirst({ where: { ownerId } });
}


export async function upsertSpawner(ownerId: string) {

  const existing = await prisma.spawner.findFirst({ where: { ownerId } });

  if (existing) {
    return existing;
  }

  const spawner = await prisma.spawner.create({
    data: {
      ownerId: ownerId,
      galaxyId: 'galaxy-456',
      spawnerType: 'BASE',
      ownerType: 'PLAYER',
      resourceType: 'IRON',
      spawnerGrade: 'EPIC',
      axisX: 42,
      axisY: 17,
      health: 100,
      // name: 'Zeta-9',
    },
  });



  const producer = await createProducer(kafkaConfig);
  producer.send(createSpawnerProducerConfig, [{ value: JSON.stringify({ id: spawner.id }) }]);

  return spawner;
}
