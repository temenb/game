import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/profile/params/profile_params.dart';
import 'package:front/src/grpc/generated/profile.pb.dart';

import './profile_service_provider.dart';

final profileProvider = FutureProvider.family<ProfileObject, ProfileParams>((
  ref,
  params,
) async {
  final service = await ref.read(profileServiceProvider(params.clientParams));

  final profileId = params.profileId;
  final profile = await service.getProfile(profileId);

  if (profile == null) {
    throw Exception("Profile $profileId not found");
  }

  return profile;
});
