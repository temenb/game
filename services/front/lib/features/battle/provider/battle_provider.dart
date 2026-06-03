import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/provider/battle_channel_provider.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';

final battleProvider = StreamProvider<BattleObject>((ref) async* {
  final battleChannel = ref.read(battleChannelProvider);

  battleChannel.join();

  yield* battleChannel.battles;

  ref.onDispose(() => battleChannel.close());
});
