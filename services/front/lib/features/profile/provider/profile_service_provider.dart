import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/auth/providers/auth_service_provider.dart';
import 'package:front/features/profile/services/profile_service.dart';
import 'package:front/src/providers/gateway_client_provider.dart';

final profileServiceProvider = Provider<ProfileService>((ref) {
  final client = ref.watch(gatewayClientProvider);
  final authService = ref.watch(authServiceProvider);
  return ProfileService(client, authService);
});
