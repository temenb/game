import 'package:front/src/grpc/generated/auth.pb.dart';
import 'package:front/src/storages/token_storage.dart';
import 'package:logger/logger.dart';

import '../clients/auth_client.dart';
import '../services/device_service.dart';

final logger = Logger();

class AuthService {
  final AuthClient authClient;
  final TokenStorage tokenStorage;

  AuthService(this.authClient, this.tokenStorage);

  Future<void> clearJwt(TokenStorage tokenStorage) async {
    await tokenStorage.deleteAccessToken();
  }

  Future<String> getOrCreateJwt() async {
    final refreshToken = await tokenStorage.readRefreshToken();
    if (refreshToken != null) {
      final AuthObject response = await this.authClient.refreshTokens(refreshToken);

      final newJwt = response.accessToken;

      await tokenStorage.saveAccessToken(newJwt);

      if (response.hasRefreshToken()) {
        await tokenStorage.saveRefreshToken(response.refreshToken);
      }
      return newJwt;
    }

    final deviceId = await DeviceService.getDeviceId();
    final response = await this.authClient.anonymousSignIn(deviceId);
    final newJwt = response.accessToken;

    await tokenStorage.saveAccessToken(newJwt);
    return newJwt;
  }
}
