import prisma from '../lib/prisma';
import logger from "@shared/logger";
import * as BattleClient from "../grpc/clients/battle.client";
import kafkaConfig, {kafkaProducersConfig} from "../config/kafka.config";
import {createProducer} from '@shared/kafka';
import * as grpc from "@grpc/grpc-js";
import {enqueueEventTx} from '../lib/pgBoss';
import {randomUUID} from "crypto";
import getUserIdFromMetadata from "../lib/getUserIdFromMetadata";

const startedAt = Date.now();

export const newBattle = async (userId: string) => {
  await prisma.$transaction(async (tx) => {
    await enqueueEventTx(kafkaProducersConfig.topicBattleNew, {userId: userId}, tx);
  });
};

export const makeMove = async (userId: string, battleId: string, colIdx: number, rowIdx: number) => {
  await prisma.$transaction(async (tx) => {
    await enqueueEventTx(kafkaProducersConfig.topicBattleMakeMove, {userId, battleId, colIdx, rowIdx}, tx);
  });
};


