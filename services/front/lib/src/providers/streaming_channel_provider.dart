import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/auth/providers/auth_service_provider.dart';
import 'package:front/src/config/streaming_config.dart';
import 'package:logger/logger.dart';

import '../clients/streaming_channel.dart';

final logger = Logger();

final streamingChannelProvider = FutureProvider<StreamingChannel>((ref) async {
  final config = StreamingConfig.fromEnv();
  final authService = await ref.watch(authServiceProvider.future);
  final jwt = await authService.getOrCreateJwt();

  final streamingChannel = StreamingChannel(config, jwt);
  logger.i("✅ StreamingChannel initialized with JWT");

  return streamingChannel;
});
