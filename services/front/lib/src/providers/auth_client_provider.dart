import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/config/gateway_config.dart';
import 'package:front/src/providers/gateway_client_provider.dart';
import 'package:logger/logger.dart';

final logger = Logger();

final authClientProvider = Provider<GatewayClient>((ref) {

  final gatewayClient = ref.watch(gatewayClientProvider);

  final authClient = AuthClient(gatewayClient);

  return authClient;
});
