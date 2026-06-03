import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/clients/gateway_client.dart';
import 'package:front/src/config/gateway_config.dart';
import 'package:logger/logger.dart';

final logger = Logger();

final gatewayClientProvider = Provider<GatewayClient>((ref) {
  final config = GatewayConfig.fromEnv();
  ;
  logger.i(config);
  logger.i('Init started with config: $config');

  final gatewayClient = GatewayClient(config);

  return gatewayClient;
});
