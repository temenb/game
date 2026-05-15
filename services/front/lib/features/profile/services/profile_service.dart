import 'package:front/features/auth/services/auth_service.dart';
import 'package:front/src/grpc/generated/common/empty.pb.dart' as $0;
import 'package:front/src/grpc/generated/gateway.pbgrpc.dart';
import 'package:grpc/grpc.dart';
import 'package:logger/logger.dart';

import '../models/profile.dart';

final logger = Logger();

class ProfileService {
  final GatewayClient gatewayClient;
  final AuthService authService;

  ProfileService(this.gatewayClient, this.authService);

  Future<Profile> viewProfile() async {
    try {
      // 1. Получаем CallOptions с JWT токеном
      final options = await authService.optionsWithAuth();

      // 2. Делаем gRPC‑вызов к GatewayClient
      final response = await gatewayClient.viewMyProfile(
        $0.Empty(),
        options: options,
      );

      return Profile(
        id: response.id,
        name: response.nickname,
        email: '',
      );
    } on GrpcError catch (e) {
      await authService.clearJwt();
      // обработка ошибок gRPC
      if (e.code == StatusCode.unauthenticated) {
        // например, JWT протух → чистим storage и пробуем заново
        await authService.clearJwt();
        throw Exception("Неавторизован: токен недействителен");
      } else {
        throw Exception("Ошибка gRPC: ${e.code} ${e.message}");
      }
    } catch (e, st) {
      logger.d('herer3');

      // обработка любых других ошибок
      throw Exception("Неизвестная ошибка: $e\n$st");
    }
  }

}
