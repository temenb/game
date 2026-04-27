import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/providers/grpc_config_provider.dart';
import '../services/profile_service.dart';
import '../models/profile.dart';

final profileProvider = FutureProvider<Profile>((ref) async {

  final service = ProfileService();

  service.init(ref);

  return await service.fetchProfile('1');
});
