import 'package:front/features/auth/services/auth_service.dart';
import 'package:front/src/grpc/generated/profile.pb.dart';
import 'package:logger/logger.dart';

import '../clients/profile_client.dart';

final logger = Logger();

class ProfileService {
  final ProfileClient profileClient;
  final AuthService authService;

  ProfileService(this.profileClient, this.authService);

  Future<ProfileObject> getProfile() async {
    final jwt = await authService.getOrCreateJwt();
    return await profileClient.getMyProfile(jwt);
  }
}
