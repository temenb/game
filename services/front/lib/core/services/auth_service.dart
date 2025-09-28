import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:grpc/grpc.dart';
import 'package:front/grpc/generated/gateway.pbgrpc.dart';
import 'package:front/grpc/generated/auth.pbgrpc.dart';
import 'package:flutter/foundation.dart';
import 'package:front/core/services/device_service.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/core/provider/config_provider.dart';

final authServiceProvider = Provider<AuthService>((ref) {
  final service = AuthService();
  service.init(ref);
  return service;
});

class AuthService {
  late final ClientChannel _channel;
  late final GatewayClient _client;

  final _storage = const FlutterSecureStorage();

  AuthService();

  void _initClient(String host, int port) {
    _channel = ClientChannel(
      host,
      port: port,
      options: const ChannelOptions(
        credentials: ChannelCredentials.insecure(),
      ),
    );
    _client = GatewayClient(_channel);
  }

  void init(ProviderRef ref) {
    final config = ref.read(configProvider);
    _initClient(config.grpcHost, config.grpcPort);
  }

  void initWithConfig(AppConfig config) {
    _initClient(config.grpcHost, config.grpcPort);
  }

  Future<String> getOrCreateJwt() async {
    final existingJwt = await _storage.read(key: 'jwt');
    // if (existingJwt != null) return existingJwt;
    try {
      final deviceId = await DeviceService.getDeviceId();
      final request = AnonymousSignInRequest(deviceId: deviceId);
      final response = await _client.anonymousSignIn(request);
      final newJwt = response.accessToken;
      debugPrint(newJwt);
      await _storage.write(key: 'jwt', value: newJwt);
      return newJwt;
    } on GrpcError catch (e) {
      rethrow;
    } catch (e, stack) {
      debugPrint('Unexpected error: $e');
      debugPrint('$stack');
      rethrow;
    }
  }

  Future<CallOptions> withAuth() async {
    final jwt = await getOrCreateJwt();
    return CallOptions(metadata: {
      'authorization': 'Bearer $jwt',
    });
  }
}
