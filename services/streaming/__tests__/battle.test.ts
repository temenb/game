import * as grpc from "@grpc/grpc-js";
import { BattleServiceClient } from "./generated/battle";
import { ClientEvent } from "./generated/battle";

describe("BattleChannel", () => {
  let client: BattleServiceClient;

  beforeAll(() => {
    client = new BattleServiceClient(
      "localhost:50051",
      grpc.credentials.createInsecure()
    );
  });

  test("JOIN creates battle", (done) => {
    const metadata = new grpc.Metadata();
    metadata.add("Authorization", "Bearer test-token");

    const call = client.BattleChannel(metadata);

    call.on("data", (battle) => {
      expect(battle.battleId).toBeDefined();
      expect(battle.status).toBe("IN_PROGRESS");
      done();
    });

    call.write({ join: {} } as ClientEvent);
  });

  test("MOVE updates battle", (done) => {
    const metadata = new grpc.Metadata();
    metadata.add("Authorization", "Bearer test-token");

    const call = client.BattleChannel(metadata);

    call.on("data", (battle) => {
      if (battle.lastMove) {
        expect(battle.lastMove.cellIndex).toBe(3);
        expect(battle.lastMove.moveType).toBe("X");
        done();
      }
    });

    call.write({
      move: {
        battleId: "battle-123",
        cellIndex: 3,
        moveType: "X",
      },
    } as ClientEvent);
  });
});
