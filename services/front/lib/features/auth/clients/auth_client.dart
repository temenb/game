import 'package:front/src/grpc/generated/auth.pb.dart';
import 'package:front/src/helpers/parse_proto.dart';
import 'package:logger/logger.dart';

import 'package:front/src/clients/gateway_client.dart';


class AuthClient extends GatewayClient {
  AuthClient(super.baseUrl, super.port);

  Future<AuthObject> anonymousSignIn(String deviceId) async {
    final jsonString = await post('/auth/anonymousSignIn', {'deviceId': deviceId});
    final logger = new Logger();
    logger.d(jsonString);
    return parseProto(() => AuthObject(), jsonString);
  }

  Future<AuthObject> refreshTokens(String refreshToken) async {
    final jsonString = await post('/auth/refreshTokens', {'token': refreshToken});
    return parseProto(() => AuthObject(), jsonString);
  }
}
