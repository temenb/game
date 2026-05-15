import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:front/features/auth/services/device_service.dart';
import 'package:front/src/grpc/generated/auth.pbgrpc.dart';
import 'package:front/src/grpc/generated/gateway.pbgrpc.dart';
import 'package:grpc/grpc.dart';
import 'package:jwt_decode/jwt_decode.dart';
import 'package:logger/logger.dart';

final logger = Logger();

class AuthService {
  final GatewayClient gatewayClient;
  final _storage = const FlutterSecureStorage();

  AuthService(this.gatewayClient);

  Future<void> init() async {
    await getOrCreateJwt();
  }

  Future<void> clearJwt() async {
    await _storage.delete(key: 'jwt');
  }

  Future<String> getOrCreateJwt() async {

    final existingJwt = await _storage.read(key: 'jwt');
    if (existingJwt != null && !Jwt.isExpired(existingJwt)) {
      return existingJwt;
    }
    
    final refreshToken = await _storage.read(key: 'refreshToken');
    if (refreshToken != null) {
      final request = RefreshTokensRequest(token: refreshToken);
      final response = await gatewayClient.refreshTokens(request);
      final newJwt = response.accessToken;

      await _storage.write(key: 'jwt', value: newJwt);
      if (response.hasRefreshToken()) {
        await _storage.write(key: 'refreshToken', value: response.refreshToken);
      }
      return newJwt;
    }


    
    final deviceId = await DeviceService.getDeviceId();
    final request = AnonymousSignInRequest(deviceId: deviceId);
    final response = await gatewayClient.anonymousSignIn(request);
    final newJwt = response.accessToken;

    await _storage.write(key: 'jwt', value: newJwt);
    return newJwt;
  }

  Future<CallOptions> optionsWithAuth() async {
    final jwt = await getOrCreateJwt();

    logger.d('optionsWithAuth - jwt = ' + jwt);
    return CallOptions(metadata: {'authorization': 'Bearer $jwt'});
  }
}
