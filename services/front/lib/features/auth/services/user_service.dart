// import 'package:flutter/foundation.dart';
// import 'package:flutter_secure_storage/flutter_secure_storage.dart';
// import 'package:../services/device_service.dart';
//
// class AuthService {
//   final GatewayClient _client;
//   final _storage = const FlutterSecureStorage();
//
//   authService(this._client);
//
//   Future<String> getOrCreateJwt() async {
//     final existingJwt = await _storage.read(key: 'jwt');
//     if (existingJwt != null) return existingJwt;
//
//     final deviceId = await DeviceService.getDeviceId();
//     final request = AnonymousSignInRequest(deviceId: deviceId);
//     final response = await _client.anonymousSignIn(request);
//     final newJwt = response.accessToken;
//     debugPrint(newJwt);
//     await _storage.write(key: 'jwt', value: newJwt);
//     return newJwt;
//   }
//
//   Future<CallOptions> withAuth() async {
//     final jwt = await getOrCreateJwt();
//     return CallOptions(metadata: {'authorization': 'Bearer $jwt'});
//   }
// }
