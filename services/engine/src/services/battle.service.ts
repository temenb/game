import prisma from '../lib/prisma';
import logger from "@shared/logger";
import * as BattleClient from "../grpc/clients/battle.client";
import kafkaConfig from "../config/kafka.config";
import {createProducer} from '@shared/kafka';
import * as grpc from "@grpc/grpc-js";

const startedAt = Date.now();

export const newBattle = async (metadata: grpc.Metadata) => {
  return BattleClient.newBattle(metadata);
};

export const makeMove = async (metadata: grpc.Metadata, battleId: string, colIdx: number, rowIdx: number) => {
  return BattleClient.makeMove(metadata, battleId, colIdx, rowIdx);
};


