import { logger } from '@shared/logger';
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function seedSpawners() {
  logger.log('👤 Spawners are created');
}
