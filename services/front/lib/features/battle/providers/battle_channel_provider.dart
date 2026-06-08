import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/clients/battle_channel.dart';
import 'package:front/src/config/streaming_config.dart';
import 'package:front/src/providers/jwt_provider.dart';
import 'package:logger/logger.dart';

final logger = Logger();

final battleChannelProvider = FutureProvider<BattleChannel>((ref) async {
  logger.i('battleChannelProvider');

  // final existing = ref.state as BattleChannel?;
  // if (existing != null) return existing;
  final config = StreamingConfig.fromEnv();

  logger.i(1);
  final jwt = await ref.read(jwtProvider.future);
  logger.i(jwt);
  logger.i(2);
  return BattleChannel(config, jwt);
});
