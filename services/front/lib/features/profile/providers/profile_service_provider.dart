import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/auth/providers/auth_service_provider.dart';
import 'package:front/features/profile/providers/profile_client_provider.dart';
import 'package:front/src/config/gateway_config.dart';
import 'package:front/src/providers/token_storage_provider.dart';

import '../clients/profile_client.dart';
import '../services/profile_service.dart';

final profileServiceProvider = FutureProvider<ProfileService>((ref) async {
  final authService = await ref.watch(authServiceProvider.future);
  final profileClient = ref.watch(profileClientProvider);
  return ProfileService(profileClient, authService);
});
