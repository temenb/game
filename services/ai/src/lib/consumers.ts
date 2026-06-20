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


export async function sendToStream(jobs: Job[]): Promise<void> {
  for (const job of jobs) {
    logger.log('sendToStream');
    console.log(job);

    try {
      const message = job?.data;
      logger.log(message);
      await battleClient.send(message);
    } catch (error) {
      logger.error(`[Websocket] Failed to process message`, {
        rawValue: job?.data,
        error,
      });
      throw error; // чтобы PgBoss сделал retry
    }
  }

}

