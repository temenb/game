// import * as streamingGrpc from "../grpc/generated/streaming";
import * as aiGrpc from "../grpc/generated/ai";
import battleClient from "../clients/battle.client";

export const connectToBattle = async (req: aiGrpc.ConnectingRequest) => {
  battleClient.join(req);
};
