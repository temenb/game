import 'package:grpc/grpc.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter/foundation.dart';

import 'package:front/src/grpc/generated/user.pbgrpc.dart';
import 'package:front/core/provider/config_provider.dart';
import 'auth_service.dart'; // чтобы использовать withAuth()

final userServiceProvider = Provider<UserService>((ref) {
  final service = UserService();
  service.init(ref);
  return service;
});

class UserService {
  late final ClientChannel _channel;
  late final UserClient _client;

  final _storage = const FlutterSecureStorage();

  void _initClient(String host, int port) {
    _channel = ClientChannel(
      host,
      port: port,
      options: const ChannelOptions(
        credentials: ChannelCredentials.insecure(),
      ),
    );
    _client = UserClient(_channel);
  }

  void init(ProviderRef ref) {
    final config = ref.read(configProvider);
    _initClient(config.grpcHost, config.grpcPort);
  }

  void initWithConfig(AppConfig config) {
    _initClient(config.grpcHost, config.grpcPort);
  }

  /// Получить профиль пользователя по userId
  Future<UserResponse> getUser(String userId, AuthService authService) async {
    final callOptions = await authService.withAuth();
    final request = GetUserRequest()..userId = userId;
    final response = await _client.getUser(request, options: callOptions);
    return response;
  }

  /// Обновить профиль (например email или имя)
  Future<UserResponse> updateUser(UpdateUserRequest request, AuthService authService) async {
    final callOptions = await authService.withAuth();
    final response = await _client.updateUser(request, options: callOptions);
    return response;
  }

  /// Удалить пользователя (если есть такой метод в proto)
  Future<void> deleteUser(String userId, AuthService authService) async {
    final callOptions = await authService.withAuth();
    final request = DeleteUserRequest()..userId = userId;
    await _client.deleteUser(request, options: callOptions);
  }
}
