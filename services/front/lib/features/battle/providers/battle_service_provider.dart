import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/params/battle_params.dart';

import '../../battle/providers/battle_channel_provider.dart';
import '../services/battle_service.dart';

final battleServiceProvider =
    FutureProvider.family<BattleService, BattleParams>((
      ref,
      battleParams,
    ) async {
      final battleChannel = await ref.read(
        battleChannelProvider(battleParams).future,
      );
      return BattleService(battleParams.profileId, battleChannel);
    });
