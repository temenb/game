import 'package:front/src/helpers/token_storage.dart';
import 'package:logger/logger.dart';

import '../clients/profile_client.dart';
import '../models/profile.dart';

final logger = Logger();

class ProfileService {
  final ProfileClient profileClient;

  ProfileService(this.profileClient);

  Future<Profile> getProfile() async {
    final jwt = await TokenStorage.readJwt()?? '';
    final response = await profileClient.getMyProfile(jwt);

    return Profile(id: response.id, name: response.nickname, email: '');
  }
}
