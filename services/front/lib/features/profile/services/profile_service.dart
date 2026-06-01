import 'package:front/features/auth/services/auth_service.dart';
import 'package:front/src/grpc/generated/common/empty.pb.dart' as $0;
import 'package:logger/logger.dart';

import '../models/profile.dart';

final logger = Logger();

class ProfileService {
  final ProfileClient profileClient;
  final AuthService authService;

  ProfileService(this.gatewayClient, this.streamingClient, this.authService);

  Future<Profile> getProfile() async {
    try {
      final options = await authService.optionsWithAuth();

      final response = await streamingClient.getMyProfile(
        $0.Empty(),
        options: options,
      );

      return Profile(
        id: response.id,
        name: response.nickname,
        email: '',
      );
    } on GrpcError catch (e) {
      await authService.clearJwt(); ///@TODO remove it

      if (e.code == StatusCode.unauthenticated) {
        await authService.clearJwt();
        throw Exception("Неавторизован: токен недействителен");
      } else {
        throw Exception("Ошибка gRPC: ${e.code} ${e.message}");
      }
    } catch (e, st) {
      throw Exception("Неизвестная ошибка: $e\n$st");
    }
  }

}
