import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/params/battle_params.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';

import '../../battle/providers/battle_channel_provider.dart';

final battleStreamProvider = StreamProvider.family<BattleObject, BattleParams>((
  ref,
  params,
) async* {
  // logger.i('battleStreamProvider');

  final battleChannel = await ref.watch(battleChannelProvider(params).future);
  // logger.i('battleChannel created');

  try {
    // logger.i('before watch');

    battleChannel.start();

    // logger.i('after watch');
  } catch (e, st) {
    logger.e('watch failed', error: e, stackTrace: st);
    rethrow;
  }

  // logger.i('Joined to stream');

  yield* battleChannel.messages;

  ref.onDispose(() => battleChannel.close());
});
