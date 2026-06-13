import * as streamingGrpc from "../grpc/generated/streaming";
import battleClient from "../clients/battle.client";

export const connectToBattle = async (battleId: string) => {
  battleClient.join(battleId);
};
