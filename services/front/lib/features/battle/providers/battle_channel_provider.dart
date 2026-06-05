import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/clients/battle_channel.dart';
import 'package:front/src/config/streaming_config.dart';
import 'package:front/src/providers/jwt_provider.dart';
import 'package:logger/logger.dart';

final logger = Logger();

final battleChannelProvider = FutureProvider<BattleChannel>((ref) async {
  final config = StreamingConfig.fromEnv();

  final jwt = await ref.read(jwtProvider.future);
  final battleChannel = BattleChannel(config, jwt);
  logger.i("✅ BattleChannel initialized with JWT");

  return battleChannel;
});
