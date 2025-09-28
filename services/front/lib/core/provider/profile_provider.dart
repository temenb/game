import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/core/services/profile_service.dart';
import 'package:front/core/models/profile.dart';

final profileProvider = FutureProvider<Profile>((ref) async {
  final service = ProfileService();
  // Временно ownerId захардкожен для теста
  return await service.fetchProfile('1');
});
