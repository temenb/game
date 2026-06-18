import {connectToBattle} from "../services/battle.service";
import logger from "@shared/logger";
import * as streamingGrpc from "../grpc/generated/streaming";
import battleClient from "../clients/battle.client";
import {Job} from 'pg-boss';

export async function connectingRequest(topic: string, partition: number, message: streamingGrpc.StartBattleRequest): Promise<void> {
  try {
    logger.log('message received', message);
    connectToBattle(message);
  } catch (error) {
    logger.error(`[Kafka] Failed to process message`, {
      rawValue: message.battleId,
      error,
    });
  }
}



export async function sendToStream(job: any): Promise<void> {
  try {
    const message = job?.data?.message;
    await battleClient.send(message);
  } catch (error) {
    logger.error(`[Websocket] Failed to process message`, {
      rawValue: job?.data,
      error,
    });
    throw error; // чтобы PgBoss сделал retry
  }
}

