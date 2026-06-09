import 'package:front/src/clients/gateway_client.dart';
import 'package:front/src/grpc/generated/profile.pb.dart';
import 'package:front/src/helpers/parse_proto.dart';
import 'package:logger/logger.dart';

class ProfileClient extends GatewayClient {
  final String jwt;

  ProfileClient(this.jwt, super.config);

  Future<ProfileObject?> getMyProfile() async {
    try {
      final jsonString = await get(
        '/profile/getMyProfile',
        headers: {'Authorization': 'Bearer ${jwt}'},
      );

      final logger = new Logger();
      logger.d(jsonString);

      return parseProto(() => ProfileObject(), jsonString);
    } catch (e, st) {
      Logger().e("getProfile failed $e $st");
      return null;
    }
  }

  Future<ProfileObject?> getProfile(String profileId) async {
    try {
      final jsonString = await get(
        '/profile/getProfile?profileId=$profileId',
        headers: {'Authorization': 'Bearer ${jwt}'},
      );

      final logger = Logger();
      logger.d(jsonString);

      return parseProto(() => ProfileObject(), jsonString);
    } catch (e, st) {
      Logger().e("getProfile failed $e $st");
      return null;
    }
  }
}
