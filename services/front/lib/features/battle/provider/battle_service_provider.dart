import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/provider/battle_channel_provider.dart';

import '../services/battle_service.dart';

final battleServiceProvider = FutureProvider<battleService>((ref) async {
  final battleChannel = await ref.watch(battleChannelProvider.future);
  return battleService(battleChannel);
});
