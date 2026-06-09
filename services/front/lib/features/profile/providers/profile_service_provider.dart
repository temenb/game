import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/profile/providers/profile_client_provider.dart';
import 'package:front/src/params/client_params.dart';

import '../services/profile_service.dart';

final profileServiceProvider = Provider.family<ProfileService, ClientParams>((
  ref,
  params,
) {
  final profileClient = ref.watch(profileClientProvider(params));
  return ProfileService(profileClient);
});
