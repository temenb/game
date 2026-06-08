import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../src/providers/jwt_provider.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';

import '../../battle/providers/battle_channel_provider.dart';

class BattleParams {
  final String profileId;

  BattleParams(this.profileId);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
          other is BattleParams &&
              profileId == other.profileId;

  @override
  int get hashCode => profileId.hashCode;
}

final battleStreamProvider = StreamProvider.family<BattleObject, BattleParams>((ref, params) async* {
  // logger.i('battleStreamProvider');

  final battleChannel = await ref.watch(
    battleChannelProvider.future,
  );
  logger.i('battleChannel created');

  try {
    logger.i('before watch');

    battleChannel.join(params.profileId);

    logger.i('after watch');
  } catch (e, st) {
    logger.e('watch failed', error: e, stackTrace: st);
    rethrow;
  }

  logger.i('Joined to stream');

  yield* battleChannel.messages;

  ref.onDispose(() => battleChannel.close());

});

