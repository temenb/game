import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/providers/token_storage_provider.dart';
import 'package:logger/logger.dart';

import '../../features/auth/providers/auth_service_provider.dart';

final jwtProvider = FutureProvider<String>((ref) async {
  final tokenStorage = ref.watch(tokenStorageProvider);

  var jwt = await tokenStorage.readAccessToken();

  if (jwt != null && jwt.isNotEmpty) {
    return jwt;
  }

  final authService = await ref.watch(authServiceProvider.future);

  var logger = Logger();

  jwt = await authService.getOrCreateJwt();
  logger.d("JWT получен: $jwt");

  tokenStorage.saveAccessToken(jwt);

  return jwt;
});
