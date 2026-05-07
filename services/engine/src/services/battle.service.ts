import prisma from '../lib/prisma';
import logger from "@shared/logger";
import * as BattleClient from "../grpc/clients/battle.client";
import kafkaConfig from "../config/kafka.config";
import {createProducer} from '@shared/kafka';
import * as grpc from "@grpc/grpc-js";
import {enqueueEventTx} from '../lib/pgBoss';
import {randomUUID} from "crypto";
import getUserIdFromMetadata from "../lib/getUserIdFromMetadata";

const startedAt = Date.now();

export const newBattle = async (metadata: grpc.Metadata) => {
  const userId = getUserIdFromMetadata();
  await prisma.$transaction(async (tx) => {
    await enqueueEventTx(tx, 'battle.new', {userId: userId});
  });
};

export const makeMove = async (metadata: grpc.Metadata, battleId: string, colIdx: number, rowIdx: number) => {
  const userId = getUserIdFromMetadata();
  await prisma.$transaction(async (tx) => {
    await enqueueEventTx(tx, 'battle.makeMove', {userId: userId});
  });
};


