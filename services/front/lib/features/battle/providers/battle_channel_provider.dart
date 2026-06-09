import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/clients/battle_channel.dart';
import 'package:front/features/battle/params/battle_params.dart';
import 'package:front/src/config/streaming_config.dart';
import 'package:logger/logger.dart';

final logger = Logger();

final battleChannelProvider =
    FutureProvider.family<BattleChannel, BattleParams>((ref, params) async {
      // logger.i('battleChannelProvider');

      // final existing = ref.state as BattleChannel?;
      // if (existing != null) return existing;
      final config = StreamingConfig.fromEnv();

      return BattleChannel(config, params.profileId, params.clientParams.jwt);
    });
