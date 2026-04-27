import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:grpc/grpc.dart';
import 'package:front/src/grpc/generated/gateway.pbgrpc.dart';
import 'package:front/src/grpc/generated/auth.pbgrpc.dart';
import 'package:flutter/foundation.dart';
import 'package:front/features/auth/services/device_service.dart';
import 'package:front/src/providers/grpc_config_provider.dart';

class AuthService {
  final ClientChannel _channel;
  final GatewayClient _client;
  final _storage = const FlutterSecureStorage();

  AuthService(GrpcConfig config)
      : _channel = ClientChannel(
    config.grpcHost,
    port: config.grpcPort,
    options: const ChannelOptions(
      credentials: ChannelCredentials.insecure(),
    ),
  ),
        _client = GatewayClient(
          ClientChannel(
            config.grpcHost,
            port: config.grpcPort,
            options: const ChannelOptions(
              credentials: ChannelCredentials.insecure(),
            ),
          ),
        );

  Future<String> getOrCreateJwt() async {
    final existingJwt = await _storage.read(key: 'jwt');
    if (existingJwt != null) return existingJwt;

    final deviceId = await DeviceService.getDeviceId();
    final request = AnonymousSignInRequest(deviceId: deviceId);
    final response = await _client.anonymousSignIn(request);
    final newJwt = response.accessToken;
    debugPrint(newJwt);
    await _storage.write(key: 'jwt', value: newJwt);
    return newJwt;
  }

  Future<CallOptions> withAuth() async {
    final jwt = await getOrCreateJwt();
    return CallOptions(metadata: {
      'authorization': 'Bearer $jwt',
    });
  }
}
