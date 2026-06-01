import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../services/auth_service.dart';
import './auth_client_provider.dart';
import 'package:logger/logger.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  final authClient = ref.watch(authClientProvider);
  var logger = Logger();

  // logger.d("Debug message");
  final authService = AuthService(authClient);
  authService.init();

  return authService;
});
