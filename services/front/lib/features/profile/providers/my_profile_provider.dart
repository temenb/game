import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/grpc/generated/profile.pb.dart';
import 'package:front/src/params/client_params.dart';

import './profile_service_provider.dart';

final myProfileProvider = FutureProvider.family<ProfileObject, ClientParams>((
  ref,
  params,
) async {
  final service = await ref.read(profileServiceProvider(params));

  final profile = await service.getMy();

  if (profile == null) {
    throw Exception("My profile not found");
  }

  return profile;
});
