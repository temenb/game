import 'package:front/src/grpc/generated/auth.pb.dart';

import './secure_storage.dart';

class TokenStorage extends SecureStorage {
  final accessTokenKey = 'accessToken';
  final refreshTokenKey = 'refreshToken';
  String? _accessToken;
  String? _refreshToken;

  Future<void> saveAuthObject(AuthObject authObject) async {
    await Future.wait([
      saveAccessToken(authObject.accessToken),
      saveRefreshToken(authObject.refreshToken),
    ]);
  }

  Future<void> saveAccessToken(String accessToken) async {
    _accessToken = accessToken;
    await save(this.accessTokenKey, accessToken);
  }

  Future<String?> readAccessToken() async {
    if (_accessToken != null && _accessToken != '') {
      return _accessToken;
    }
    _accessToken = await read(this.accessTokenKey);
    return _accessToken;
  }

  Future<void> deleteAccessToken() async {
    _accessToken = null;
    return await delete(this.accessTokenKey);
  }

  Future<void> saveRefreshToken(String refreshToken) async {
    _refreshToken = refreshToken;
    await save(this.refreshTokenKey, refreshToken);
  }

  Future<String?> readRefreshToken() async {
    if (_refreshToken != null && _refreshToken != '') {
      return _refreshToken;
    }
    return await read(this.refreshTokenKey);
  }

  Future<void> deleteRefreshToken() async {
    return await delete(this.refreshTokenKey);
  }

  Future<void> clearAll() async {
    await Future.wait([deleteAccessToken(), deleteRefreshToken()]);
  }
}
