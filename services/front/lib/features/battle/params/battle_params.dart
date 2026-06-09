import 'package:front/src/params/client_params.dart';

class BattleParams {
  final ClientParams clientParams;
  final String profileId;

  BattleParams(this.clientParams, this.profileId);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is BattleParams &&
          clientParams == other.clientParams &&
          profileId == other.profileId;

  @override
  int get hashCode => Object.hash(clientParams, profileId);
}
