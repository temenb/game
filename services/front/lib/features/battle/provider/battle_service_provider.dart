import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/provider/battle_channel_provider.dart';

import '../services/battle_service.dart';

final battleServiceProvider = FutureProvider<BattleService>((ref) async {
  final battleChannel = await ref.watch(battleChannelProvider);
  final battleService = new BattleService(battleChannel);
  return battleService;
});
