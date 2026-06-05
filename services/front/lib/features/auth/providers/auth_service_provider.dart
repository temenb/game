import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/providers/token_storage_provider.dart';
import 'package:logger/logger.dart';

import '../services/auth_service.dart';
import './auth_client_provider.dart';

final authServiceProvider = FutureProvider<AuthService>((ref) async {
  final authClient = ref.watch(authClientProvider);
  final tokenStorage = ref.watch(tokenStorageProvider);
  var logger = Logger();

  // logger.d("Debug message");
  final authService = AuthService(authClient, tokenStorage);

  return authService;
});
