import {prisma} from '../lib/prisma';
import {createProducer} from '@shared/kafka';
import kafkaConfig, {createBattleProducerConfig} from "../config/kafka.config";

// export async function findBattle(ownerId: string) {
//   return prisma.battle.findFirst({where: {ownerId}});
// }
//
// export async function upsertBattle(ownerId: string) {
//
//   const existing = await prisma.battle.findUnique({where: {ownerId}});
//
//   if (existing) {
//     return existing;
//   }
//
//   const nickname = generateGuestNickname();
//
//   const battle = await prisma.battle.upsert({
//     where: {ownerId},
//     create: {ownerId, nickname},
//     update: {nickname},
//   });
//
//   const producer = await createProducer(kafkaConfig);
//   producer.send(createBattleProducerConfig, [{value: JSON.stringify({ownerId: battle.id})}]);
//
//   return battle;
// }
//
// export async function getBattle(ownerId: string) {
//   return prisma.battle.findUnique({
//     where: {ownerId: ownerId},
//   });
// }
//
//
// function generateGuestNickname(): string {
//   const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
//
//   return `Guest${randomDigits}`;
// }
