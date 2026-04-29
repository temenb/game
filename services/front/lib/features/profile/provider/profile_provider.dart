import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/auth/providers/auth_service_provider.dart';
import 'package:front/src/providers/grpc_client_provider.dart';
import '../services/profile_service.dart';
import '../models/profile.dart';

final profileProvider = FutureProvider<Profile>((ref) async {
  
  final channel = ref.read(grpcChannelProvider);
  final authService = ref.read(authServiceProvider);
  final service = ProfileService(channel, authService);
  
  return await service.fetchProfile();
  //  return await service.fetchProfile(profileId);
});
