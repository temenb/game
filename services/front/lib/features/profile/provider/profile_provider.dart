import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/profile/provider/profile_service_provider.dart';
import '../services/profile_service.dart';
import '../models/profile.dart';

final profileProvider = FutureProvider<Profile>((ref) async {
  final service = ref.read(profileServiceProvider); // достаём сервис
  return service.viewProfile(); // например, текущий userId
});
