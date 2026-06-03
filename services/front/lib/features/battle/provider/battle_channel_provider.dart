import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/auth/providers/auth_service_provider.dart';
import 'package:front/features/battle/clients/battle_channel.dart';
import 'package:front/src/config/streaming_config.dart';
import 'package:logger/logger.dart';

final logger = Logger();

final battleChannelProvider = FutureProvider<BattleChannel>((ref) async {
  final config = StreamingConfig.fromEnv();
  final authService = await ref.watch(authServiceProvider.future);
  final jwt = await authService.getOrCreateJwt();

  final battleChannel = BattleChannel(config, jwt);
  logger.i("✅ BattleChannel initialized with JWT");

  return battleChannel;
});

