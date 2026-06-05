import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/provider/battle_channel_provider.dart';
import 'package:front/features/battle/provider/battle_stream_provider.dart';
import 'package:front/features/profile/provider/profile_provider.dart';

import '../services/battle_service.dart';

final battleServiceProvider = FutureProvider<BattleService>((ref) async {
  final battleChannel = await ref.watch(battleChannelProvider.future);
  final battleStream = ref.watch(battleStreamProvider);
  final profile = await ref.read(profileProvider);
  return BattleService(profile.id, battleChannel, battleStream);
});
