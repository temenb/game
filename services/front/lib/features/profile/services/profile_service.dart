import 'package:front/features/auth/services/auth_service.dart';
import 'package:front/src/grpc/generated/common/empty.pb.dart' as $0;
import 'package:front/src/grpc/generated/gateway.pbgrpc.dart';
import 'package:grpc/service_api.dart';
import 'package:logger/logger.dart';

import '../models/profile.dart';

final logger = Logger();

class ProfileService {
  final GatewayClient gatewayClient;
  final AuthService authService;

  ProfileService(this.gatewayClient, this.authService);


  Future<Profile> viewProfile() async {
    final options = await authService.optionsWithAuth();
    final response = await gatewayClient.viewMyProfile($0.Empty(), options: options);
    return Profile(id: response.id, name: response.nickname, email: '');
  }
}
