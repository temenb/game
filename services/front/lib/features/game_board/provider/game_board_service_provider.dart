import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/auth/providers/auth_service_provider.dart';
import 'package:front/features/game_board/services/game_board_service.dart';
import 'package:front/src/providers/gateway_client_provider.dart';

final gameBoardServiceProvider = Provider<GameBoardService>((ref) {
  final client = ref.watch(gatewayClientProvider);
  final authService = ref.watch(authServiceProvider);
  return GameBoardService(client, authService);
});
