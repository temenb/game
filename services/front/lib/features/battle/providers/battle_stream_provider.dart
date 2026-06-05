import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../src/providers/jwt_provider.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';

import '../../battle/providers/battle_channel_provider.dart';

class BattleParams {
  final String profileId;

  BattleParams(this.profileId);
}

final battleStreamProvider = StreamProvider.family<BattleObject, BattleParams>((
  ref,
  params,
) async* {
  logger.e('battleStreamProvider');
  final battleChannel = await ref.watch(battleChannelProvider.future);
  battleChannel.join(params.profileId);

  yield* battleChannel.battles;

  ref.onDispose(() => battleChannel.close());
});
