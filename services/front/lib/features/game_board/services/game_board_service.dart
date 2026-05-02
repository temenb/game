import 'package:front/features/auth/services/auth_service.dart';
import 'package:front/src/grpc/generated/gateway.pbgrpc.dart';
import 'package:logger/logger.dart';

import '../models/game_board.dart';

final logger = Logger();

class GameBoardService {
  final GatewayClient gatewayClient;
  final AuthService authService;

  GameBoardService(this.gatewayClient, this.authService);

  Future<GameBoard> viewGameBoard() async {
    // final options = await authService.optionsWithAuth();
    // final response = await gatewayClient.viewMyGameBoard(
    //   $0.Empty(),
    //   options: options,
    // );
    return GameBoard(id: 'response.id', name: 'response.nickname', email: '');
  }
}
