import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/auth/services/auth_service.dart';
import 'package:front/features/battle/clients/battle_channel.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';
import 'package:logger/logger.dart';

final logger = Logger();

class BattleService {
  final BattleChannel battleChannel;
  final AsyncValue<BattleObject> battleObject;
  final String profileId;

  BattleService(this.profileId, this.battleChannel, this.battleObject);

  void init() async {
    await getBattle();
  }

  Future<BattleObject> getBattle() async {
    if (this.battleObject == null) {
      await BattleChannel.join(this.profileId);
    }

    return new BattleObject(
      response.id,
      response.players,
      response.cells,
      response.status,
      response.winner,
    );
  }
}
