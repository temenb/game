import 'package:front/features/auth/services/auth_service.dart';
import 'package:front/features/battle/clients/battle_channel.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';
import 'package:logger/logger.dart';

final logger = Logger();

class BattleService {
  final BattleChannel battleChannel;
  BattleObject? battle;

  BattleService(this.battleChannel);

  Future<BattleObject> getBattle() async {
    if (this.battle == null) {
      this.battle = await battleChannel.join();
    }

    return new BattleObject(response.id, response.players, response.cells, response.status, response.winner);
  }

}
