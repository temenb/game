import 'package:front/features/battle/clients/battle_channel.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';
import 'package:logger/logger.dart';

final logger = Logger();

class BattleService {
  final String profileId;
  final BattleChannel channel;

  BattleService(this.profileId, this.channel);

  makeMove(BattleObject battle, int cellIdx) {
    if (canMove(battle)) {
      channel.move(battle.id, cellIdx);
    }
  }

  leave() {
    channel.leave();
  }

  canMove(BattleObject battle) {
    if (battle.status != BattleStatus.ACTIVE) {
      return false;
    }

    if (battle.players.length < 2) {
      return false;
    }

    final filledCount = battle.cells
        .where((c) => c != BattleCellValue.CELL_EMPTY)
        .length;

    final currentTurnIndex = filledCount % battle.players.length;

    final currentPlayerId = battle.players[currentTurnIndex];

    return (currentPlayerId == profileId);
  }
}
