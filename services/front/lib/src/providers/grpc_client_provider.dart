import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/config/grpc_config.dart';
import 'package:front/src/grpc/generated/gateway.pbgrpc.dart';
import 'package:grpc/grpc.dart';
import 'package:logger/logger.dart';

final logger = Logger();

final grpcClientProvider = Provider<GatewayClient>((ref) {
  final config = GrpcConfig.fromEnv();;
  logger.i(config);
  logger.i('Init started with config: $config');
  final channel = ClientChannel(
    config.grpcHost,
    port: config.grpcPort,
    options: const ChannelOptions(
      credentials: ChannelCredentials.insecure(),
    ),
  );

  final grpcClient = GatewayClient(channel);

  return grpcClient;
});
