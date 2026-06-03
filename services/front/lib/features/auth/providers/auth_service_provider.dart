import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:logger/logger.dart';

import '../services/auth_service.dart';
import './auth_client_provider.dart';

final authServiceProvider = FutureProvider<AuthService>((ref) {
  final authClient = ref.watch(authClientProvider);
  var logger = Logger();

  // logger.d("Debug message");
  final authService = AuthService(authClient);
  authService.init();

  return authService;
});
