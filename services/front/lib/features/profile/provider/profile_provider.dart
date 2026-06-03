import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/profile/provider/profile_service_provider.dart';
import 'package:front/src/grpc/generated/profile.pb.dart';

final profileProvider = FutureProvider<ProfileObject>((ref) async {
  final service = ref.read(profileServiceProvider); // достаём сервис
  return service.getProfile(); // например, текущий userId
});
