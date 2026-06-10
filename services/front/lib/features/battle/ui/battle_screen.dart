import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/params/battle_params.dart';
import 'package:front/features/battle/providers/battle_service_provider.dart';
import 'package:front/features/battle/services/battle_service.dart';
import 'package:front/features/profile/providers/my_profile_provider.dart';
import 'package:front/features/profile/widgets/player_name.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';
import 'package:front/src/grpc/generated/profile.pb.dart';
import 'package:front/src/params/client_params.dart';
import 'package:front/src/providers/jwt_provider.dart';

import '../../battle/providers/battle_stream_provider.dart';

class BattleScreen extends ConsumerWidget {
  const BattleScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final jwtAsync = ref.watch(jwtProvider);

    return jwtAsync.when(
      data: (jwt) {
        final ClientParams clientParams = ClientParams(jwt);
        final profileAsync = ref.watch(myProfileProvider(clientParams));
        return profileAsync.when(
          data: (profile) {
            final battleParams = BattleParams(clientParams, profile.id);
            final battleServiceAsync = ref.watch(
              battleServiceProvider(battleParams),
            );
            return battleServiceAsync.when(
              data: (battleService) {
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
                          profile: profile,
                          battleService: battleService,
                          // profileService: profileService,
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
          error: (e, _) => Text("Profile error: $e"),
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

  // final ProfileService profileService;
  final ProfileObject profile;

  // final WidgetRef ref;

  const _BattleBoard({
    required this.profile,
    required this.battle,
    required this.battleService,
    // required this.profileService,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            for (int i = 0; i < battle.players.length; i++) ...[
              PlayerName(profileId: battle.players[i]),
              if (i < battle.players.length - 1)
                const Text(' vs '),
            ],
          ],
        ),

        Text('Статус: ${battle.status}'),
        if (battle.winner.isNotEmpty)
          Text('Победитель: ${PlayerName(profileId: battle.winner)}'),
        const SizedBox(height: 8),
        Expanded(
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
            ),
            itemCount: 9,
            itemBuilder: (context, index) {
              debugPrint("Cells raw: ${battle.cells}");
              final cellValue = safeCellAt(battle.cells, index);
              return GestureDetector(
                onTap: () {
                  if (battleService.canMove(battle)) {
                    battleService.makeMove(battle, index);
                  }
                },
                child: Container(
                  margin: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.white), // белая рамка
                    color: Colors.grey[900],
                  ),
                  child: Center(
                    child: Text(
                      _renderCell(cellValue),
                      style: TextStyle(
                        fontSize: 32,
                        color: _cellColor(
                          cellValue,
                        ), // цвет зависит от значения
                      ),
                    ),
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  BattleCellValue safeCellAt(List<BattleCellValue> cells, int index) {
    if (index >= 0 && index < cells.length) {
      return cells[index];
    }
    return BattleCellValue.CELL_EMPTY;
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

  Color _cellColor(BattleCellValue value) {
    switch (value) {
      case BattleCellValue.CELL_X:
        return Colors.red; // X красный
      case BattleCellValue.CELL_O:
        return Colors.blue; // O синий
      case BattleCellValue.CELL_EMPTY:
      default:
        return Colors.white; // пустая клетка белая
    }
  }
}
