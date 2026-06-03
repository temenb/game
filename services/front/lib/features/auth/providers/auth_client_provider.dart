import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/config/gateway_config.dart';
import 'package:logger/logger.dart';

import '../clients/auth_client.dart';

final logger = Logger();

final authClientProvider = Provider<AuthClient>((ref) {
  final config = GatewayConfig.fromEnv();

  final authClient = AuthClient(config);

  return authClient;
});
