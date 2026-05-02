import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/game_board/provider/game_board_service_provider.dart';

import '../models/game_board.dart';

final gameBoardProvider = FutureProvider<GameBoard>((ref) async {
  final service = ref.read(gameBoardServiceProvider); // достаём сервис
  return service.viewGameBoard(); // например, текущий userId
});
