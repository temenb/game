import { upsertBattle } from "../../../../src/services/battle.service";
import {enqueueEventTx} from "@shared/pg-boss/src/enqueueEvent";
import { BattleStatus } from "@prisma/client";
import prisma from "../../../../src/lib/prisma";
import logger from "@shared/logger/dist";

jest.mock("@shared/pg-boss/src/enqueueEvent", () => ({
  enqueueEventTx: jest.fn(),
}));


beforeEach(async () => {
  await prisma.battle.deleteMany();
  // при необходимости чистим и другие таблицы
});

describe("upsertBattle", () => {
  const userId1 = crypto.randomUUID();
  const userId2 = crypto.randomUUID();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("golden hummer", async () => {
    logger.log(userId1);
    logger.log(userId2);
    const battle1 = await upsertBattle(userId1);

    expect(battle1.players).toContain(userId1);
    expect(battle1.playersCount).toEqual(1);

    const existingBattle = await upsertBattle(userId1);

    expect(battle1).toEqual(existingBattle);

    const battle = await upsertBattle(userId2);

    expect(battle.id).toEqual(battle1.id);
    expect(battle.playersCount).toEqual(2);
    expect(battle.players).toContain(userId1);
    expect(battle.players).toContain(userId2);



  });

  // test("возвращает мой активный баттл", async () => {
  //
  //   const myBattle = { id: "battle-1", players: [userId1, userId2], status: BattleStatus.Active };
  //   (prisma.battle.findFirst as jest.Mock).mockResolvedValueOnce(myBattle);
  //
  //
  //   expect(result).toEqual(myBattle);
  //   expect(prisma.battle.findFirst).toHaveBeenCalledWith({
  //     where: { players: { has: userId1 }, status: { not: BattleStatus.Finished } },
  //   });
  // });
  //
  // test("присоединяется к чужому баттлу", async () => {
  //   const otherBattle = { id: "battle-2", players: ["other"], playersCount: 1, status: BattleStatus.Active };
  //   (prisma.battle.findFirst as jest.Mock)
  //     .mockResolvedValueOnce(null) // мой баттл не найден
  //     .mockResolvedValueOnce(otherBattle); // чужой найден
  //
  //   (prisma.battle.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
  //   const updatedBattle = { ...otherBattle, players: ["other", userId1], playersCount: 2 };
  //   (prisma.battle.findUnique as jest.Mock).mockResolvedValue(updatedBattle);
  //
  //   const result = await upsertBattle(userId1);
  //
  //   expect(result).toEqual(updatedBattle);
  //   expect(prisma.battle.updateMany).toHaveBeenCalled();
  //   expect(enqueueEventTx).toHaveBeenCalled();
  // });
  //
  // test("ошибка если чужой баттл уже занят", async () => {
  //   const otherBattle = { id: "battle-3", players: ["other"], playersCount: 1, status: BattleStatus.Active };
  //   (prisma.battle.findFirst as jest.Mock)
  //     .mockResolvedValueOnce(null)
  //     .mockResolvedValueOnce(otherBattle);
  //
  //   (prisma.battle.updateMany as jest.Mock).mockResolvedValue({ count: 0 });
  //
  //   await expect(upsertBattle(userId1)).rejects.toThrow("Battle already full or finished");
  // });
  //
  // test("ошибка если баттл не найден после update", async () => {
  //   const otherBattle = { id: "battle-4", players: ["other"], playersCount: 1, status: BattleStatus.Active };
  //   (prisma.battle.findFirst as jest.Mock)
  //     .mockResolvedValueOnce(null)
  //     .mockResolvedValueOnce(otherBattle);
  //
  //   (prisma.battle.updateMany as jest.Mock).mockResolvedValue({ count: 1 });
  //   (prisma.battle.findUnique as jest.Mock).mockResolvedValue(null);
  //
  //   await expect(upsertBattle(userId1)).rejects.toThrow("Unknown error");
  // });
});
