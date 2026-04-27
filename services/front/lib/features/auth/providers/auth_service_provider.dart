import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/auth/services/auth_service.dart';
import 'package:front/src/providers/grpc_config_provider.dart';


final authServiceProvider = Provider<AuthService>((ref) {
  final config = ref.watch(grpcConfigProvider);
  return AuthService(config);
});
