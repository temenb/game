import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class TokenStorage {
  static const FlutterSecureStorage _storage = FlutterSecureStorage();

  static Future<void> saveJwt(String jwt) async {
    await _storage.write(key: 'jwt', value: jwt);
  }

  static Future<String?> readJwt() async {
    return await _storage.read(key: 'jwt');
  }

  static Future<void> deleteJwt() async {
    await _storage.delete(key: 'jwt');
  }

  static Future<void> saveRefreshToken(String refreshToken) async {
    await _storage.write(key: 'refreshToken', value: refreshToken);
  }

  static Future<String?> readRefreshToken() async {
    return await _storage.read(key: 'refreshToken');
  }

  static Future<void> deleteRefreshToken() async {
    await _storage.delete(key: 'refreshToken');
  }

  static Future<void> clearAll() async {
    await _storage.delete(key: 'jwt');
    await _storage.delete(key: 'refreshToken');
  }
}
