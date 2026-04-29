import 'package:front/features/auth/services/user_service.dart';
import 'package:front/src/grpc/generated/profile.pbgrpc.dart';
import 'package:grpc/grpc.dart';
import '../models/profile.dart';

class ProfileService {
  final ClientChannel channel;
  final AuthService authService;
  late final ProfileClient profileClient;

  ProfileService(this.channel, this.authService) : profileClient = ProfileClient(channel);


  Future<Profile> fetchProfile() async {
    await authService.getOrCreateJwt();

    return Profile(
      id: 'response.id',
      name: 'response.nickname',
      email: '',
    );
    // final request = ViewRequest()..id = profileId;
    // final response = await profileClient.view(request);
    // return Profile(
    //   id: response.id,
    //   name: response.nickname,
    //   email: '',
    // );
  }
}
