import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/auth/services/auth_service.dart';
import 'package:front/src/providers/gateway_client_provider.dart';
import 'package:logger/logger.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  final config = ref.watch(gatewayClientProvider);
  var logger = Logger();

  // logger.d("Debug message");
  final authService = AuthService(config);
  authService.init();

  return authService;
});
