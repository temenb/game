import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/params/battle_params.dart';
import 'package:front/features/battle/providers/battle_service_provider.dart';
import 'package:front/features/battle/services/battle_service.dart';
import 'package:front/features/profile/params/profile_params.dart';
import 'package:front/features/profile/providers/profile_provider.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';
import 'package:front/src/providers/jwt_provider.dart';

import '../../battle/providers/battle_stream_provider.dart';

class BattleScreen extends ConsumerWidget {
  const BattleScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final jwtAsync = ref.watch(jwtProvider);

    return jwtAsync.when(
      data: (jwt) {
        final ProfileParams profileParams = ProfileParams(jwt);
        final profileAsync = ref.watch(profileProvider(profileParams));
        return profileAsync.when(
          data: (profile) {
            final battleParams = BattleParams(jwt, profile.id);
            final battleServiceAsync = ref.watch(
              battleServiceProvider(battleParams),
            );
            return battleServiceAsync.when(
              data: (battleService) {
                // debugPrint("Profile state: $profileAsync");
                // debugPrint("Profile state: $profileAsync");

                final battleAsync = ref.watch(
                  battleStreamProvider(battleParams),
                );

                return battleAsync.when(
                  data: (battle) {
                    try {
                      debugPrint("Battle state: $battle");
                      return Scaffold(
                        appBar: AppBar(
                          title: const Text('Battle: Tic Tac Toe'),
                        ),
                        body: _BattleBoard(
                          battle: battle,
                          battleService: battleService,
                        ),
                      );
                    } catch (e, st) {
                      debugPrint("UI error: $e\n$st");
                      return Text("UI error: ${e.toString()}");
                    }
                  },
                  loading: () {
                    debugPrint("Battle stream loading...");
                    return const Center(child: CircularProgressIndicator());
                  },
                  error: (err, stack) {
                    debugPrint("Battle stream error: $err\n$stack");
                    return Center(child: Text('Ошибка: $err'));
                  },
                );
              },
              loading: () => const Center(child: CircularProgressIndicator()),
              error: (e, _) => Text("Profile error: $e"),
            );
          },
          loading: () => const Center(child: CircularProgressIndicator()),
          error: (e, _) => Text("Profile Service error: $e"),
        );
      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Text("Auth error: $e"),
    );
  }
}

class _BattleBoard extends StatelessWidget {
  final BattleObject battle;
  final BattleService battleService;

  const _BattleBoard({required this.battle, required this.battleService});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Игроки: ${battle.players.join(" vs ")}'),
        Text('Статус: ${battle.status}'),
        if (battle.winner.isNotEmpty) Text('Победитель: ${battle.winner}'),
        //допиши
      ],
    );
  }

  String _renderCell(BattleCellValue value) {
    switch (value) {
      case BattleCellValue.CELL_X:
        return 'X';
      case BattleCellValue.CELL_O:
        return 'O';
      case BattleCellValue.CELL_EMPTY:
      default:
        return '';
    }
  }
}
