import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/auth/services/auth_service.dart';
import 'package:front/src/clients/auth_client.dart';
import 'package:front/src/config/gateway_config.dart';
import 'package:logger/logger.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  final config = GatewayConfig.fromEnv();
  final authClient = AuthClient(config.host, config.port);
  var logger = Logger();

  // logger.d("Debug message");
  final authService = AuthService(authClient);
  authService.init();

  return authService;
});
