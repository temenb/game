import {prisma} from '../lib/prisma';
import {createProducer} from '@shared/kafka';
import kafkaConfig, {createGameBoardProducerConfig} from "../config/kafka.config";

export async function findGameBoard(ownerId: string) {
  return prisma.gameBoard.findFirst({where: {ownerId}});
}

export async function upsertGameBoard(ownerId: string) {

  const existing = await prisma.gameBoard.findUnique({where: {ownerId}});

  if (existing) {
    return existing;
  }

  const nickname = generateGuestNickname();

  const gameBoard = await prisma.gameBoard.upsert({
    where: {ownerId},
    create: {ownerId, nickname},
    update: {nickname},
  });

  const producer = await createProducer(kafkaConfig);
  producer.send(createGameBoardProducerConfig, [{value: JSON.stringify({ownerId: gameBoard.id})}]);

  return gameBoard;
}

export async function getGameBoard(ownerId: string) {
  return prisma.gameBoard.findUnique({
    where: {ownerId: ownerId},
  });
}


function generateGuestNickname(): string {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);

  return `Guest${randomDigits}`;
}
