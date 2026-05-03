import 'package:front/features/auth/services/auth_service.dart';
import 'package:front/src/grpc/generated/gateway.pbgrpc.dart';
import 'package:logger/logger.dart';

import '../models/battle.dart';

final logger = Logger();

class BattleService {
  final GatewayClient gatewayClient;
  final AuthService authService;

  BattleService(this.gatewayClient, this.authService);

  Future<Battle> viewBattle() async {
    // final options = await authService.optionsWithAuth();
    // final response = await gatewayClient.viewMyBattle(
    //   $0.Empty(),
    //   options: options,
    // );
    return Battle(id: 'response.id', name: 'response.nickname', email: '');
  }
}
