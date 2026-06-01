import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:front/features/auth/services/device_service.dart';
import 'package:front/src/clients/auth_client.dart';
import 'package:front/src/grpc/generated/auth.pb.dart';
import 'package:front/helpers/token_storage.dart';
import 'package:jwt_decode/jwt_decode.dart';
import 'package:logger/logger.dart';

final logger = Logger();

class AuthService {
  final _storage = const FlutterSecureStorage();
  final AuthClient authClient;

  AuthService(this.authClient);

  Future<void> init() async {
    await getOrCreateJwt();
  }

  Future<void> clearJwt() async {
    await TokenStorage.deleteJwt();
  }

  Future<String> getOrCreateJwt() async {

    final existingJwt = await TokenStorage.readJwt();
    if (existingJwt != null && !Jwt.isExpired(existingJwt)) {
      return existingJwt;
    }
    
    final refreshToken = await TokenStorage.readRefreshToken();
    if (refreshToken != null) {
      final AuthObject response = await this.authClient.refreshTokens(refreshToken);

      final newJwt = response.accessToken;

      await TokenStorage.saveJwt(newJwt);

      if (response.hasRefreshToken()) {
        await TokenStorage.saveRefreshToken(response.refreshToken);
      }
      return newJwt;
    }


    
    final deviceId = await DeviceService.getDeviceId();
    final response = await this.authClient.anonymousSignIn(deviceId);
    final newJwt = response.accessToken;

    await TokenStorage.saveJwt(newJwt);
    return newJwt;
  }
}
