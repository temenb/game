import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/clients/battle_channel.dart';
import 'package:front/features/battle/provider/battle_channel_provider.dart';
import 'package:front/features/profile/provider/profile_provider.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';

final battleStreamProvider = StreamProvider<BattleObject>((ref) async* {
  final battleChannel = await ref.read(battleChannelProvider.future);
  final profile = await ref.read(profileProvider.future);

  battleChannel.join(profile.id);

  yield* battleChannel.battles;

  ref.onDispose(() => battleChannel.close());
});
