import 'package:front/src/clients/gateway_client.dart';
import 'package:front/src/grpc/generated/profile.pb.dart';
import 'package:front/src/helpers/parse_proto.dart';
import 'package:logger/logger.dart';

class ProfileClient extends GatewayClient {
  ProfileClient(super.config);

  Future<ProfileObject> getMyProfile(String jwt) async {
    final jsonString = await get(
      '/profile/getMyProfile',
      headers: {'Authorization': 'Bearer $jwt'},
    );
    final logger = new Logger();
    logger.d(jsonString);
    return parseProto(() => ProfileObject(), jsonString);
  }
}
