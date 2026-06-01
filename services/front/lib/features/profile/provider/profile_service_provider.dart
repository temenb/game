import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/auth/providers/auth_service_provider.dart';
import 'package:front/src/config/gateway_config.dart';

import '../clients/profile_client.dart';
import '../services/profile_service.dart';

final profileServiceProvider = Provider<ProfileService>((ref) {
  ref.watch(authServiceProvider);
  final config = GatewayConfig.fromEnv();
  final profileClient = ProfileClient(config.host, config.port);
  return ProfileService(profileClient);
});
