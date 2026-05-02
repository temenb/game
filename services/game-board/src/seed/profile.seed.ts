import {logger} from '@shared/logger';
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function seedGameBoards() {
  const gameBoards = await Promise.all(
    [...Array(100)].map(async (_, i) => ({
      id: `user-${i + 1}`,
      ownerId: `gameBoard-${i + 1}`,
      nickname: `Guest${i + 1}`,
      level: 1,
    }))
  );

  // Создаём профили только если их ещё нет
  for (const gameBoard of gameBoards) {
    const exists = await prisma.gameBoard.findUnique({where: {id: gameBoard.id}});
    if (!exists) {
      await prisma.gameBoard.create({data: gameBoard});
    }
  }

  logger.log('👤 GameBoards are created');
}
