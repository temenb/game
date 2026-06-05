import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/provider/battle_channel_provider.dart';
import 'package:front/features/profile/provider/profile_provider.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';

class BattleParams {
  final String jwt;
  final String profileId;

  BattleParams(this.jwt, this.profileId);
}

final battleStreamProvider = StreamProvider.family<BattleObject, BattleParams>((
  ref,
  params,
) async* {
  final battleChannel = await ref.read(battleChannelProvider(params.jwt).future);
  battleChannel.join(params.profileId);

  yield* battleChannel.battles;

  ref.onDispose(() => battleChannel.close());
});
