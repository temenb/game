import 'package:front/features/battle/clients/battle_channel.dart';
import 'package:front/features/battle/params/battle_params.dart';
import 'package:logger/logger.dart';

final logger = Logger();

class BattleService {
  final String profileId;
  final String jwt;
  final BattleChannel channel;

  BattleService(this.jwt, this.profileId, this.channel);

  makeMove(battleId, cellIdx) {
    channel.move(profileId, battleId, cellIdx);
  }
}
