import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/profile/params/profile_params.dart';
import 'package:front/features/profile/providers/profile_client_provider.dart';

import '../services/profile_service.dart';

final profileServiceProvider =
    FutureProvider.family<ProfileService, ProfileParams>((
      ref,
      params,
    ) async {
      final profileClient = ref.watch(profileClientProvider(params));
      return ProfileService(profileClient);
    });
