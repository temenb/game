import 'package:flutter_riverpod/flutter_riverpod.dart';
import './profile_service_provider.dart';
import 'package:front/src/grpc/generated/profile.pb.dart';

final profileProvider = FutureProvider<ProfileObject>((ref) async {
  final service = await ref.read(profileServiceProvider.future); // достаём сервис
  return service.getProfile(); // например, текущий userId
});
