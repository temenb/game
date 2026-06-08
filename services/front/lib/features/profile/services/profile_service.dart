import 'package:front/src/grpc/generated/profile.pb.dart';
import 'package:logger/logger.dart';

import '../clients/profile_client.dart';

final logger = Logger();




class ProfileService {
  final ProfileClient profileClient;

  ProfileService(this.profileClient);

  Future<ProfileObject> getProfile() async {
    return await profileClient.getMyProfile();
  }
}
