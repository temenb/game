import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/config/streaming_config.dart';
import 'package:front/src/grpc/generated/streaming.pbgrpc.dart';
import 'package:grpc/grpc.dart';
import 'package:logger/logger.dart';

final logger = Logger();

final streamingClientProvider = Provider<StreamingClient>((ref) {
  final config = StreamingConfig.fromEnv();;
  logger.i(config);
  logger.i('Init started with config: $config');
  final channel = ClientChannel(
    config.host,
    port: config.port,
    options: const ChannelOptions(
      credentials: ChannelCredentials.insecure(),
    ),
  );

  final gatewayClient = StreamingClient(channel);

  return gatewayClient;
});
