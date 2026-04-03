import { logger } from '@shared/logger';
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

export async function seedSpawns() {
  logger.log('👤 Spawns are created');
}
