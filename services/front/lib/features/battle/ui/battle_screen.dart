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
import 'package:front/widgets/turn_timer.dart';

import '../../battle/providers/battle_stream_provider.dart';

class BattleScreen extends ConsumerStatefulWidget {
  const BattleScreen({super.key});

  @override
  ConsumerState<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends ConsumerState<BattleScreen> {
  late BattleService battleService;

  @override
  Widget build(BuildContext context) {
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
              data: (service) {
                battleService = service;
                final battleAsync = ref.watch(
                  battleStreamProvider(battleParams),
                );

                return battleAsync.when(
                  data: (battle) {
                    if (battle.status == BattleStatus.FINISHED) {
                      WidgetsBinding.instance.addPostFrameCallback((_) {
                        showDialog(
                          context: context,
                          barrierDismissible: false,
                          builder: (_) => AlertDialog(
                            title: const Text("Матч завершён"),
                            content: battle.winner.isEmpty
                                ? const Text("Ничья")
                                : Row(
                                    children: [
                                      const Text("Победитель: "),
                                      PlayerName(profileId: battle.winner),
                                    ],
                                  ),
                            actions: [
                              TextButton(
                                onPressed: () {
                                  // начать новую игру
                                  // battleService.startNewBattle(profile.id);
                                  Navigator.of(context).pop();
                                },
                                child: const Text("Играть ещё"),
                              ),
                              TextButton(
                                onPressed: () {
                                  // выйти в меню
                                  Navigator.of(context).pop();
                                  Navigator.of(
                                    context,
                                  ).pushReplacementNamed("/");
                                },
                                child: const Text("Выйти в меню"),
                              ),
                            ],
                          ),
                        );
                      });
                    }

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

  @override
  void dispose() {
    battleService?.leave();
    super.dispose();
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
        if (battle.players.length > 1) ...[
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              for (int i = 0; i < battle.players.length; i++) ...[
                PlayerName(profileId: battle.players[i]),
                if (i < battle.players.length - 1) const Text(' vs '),
              ],
            ],
          ),
          battle.winner.isNotEmpty
              ? Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text('Winner: '),
                    PlayerName(profileId: battle.winner),
                  ],
                )
              : (battleService.canMove(battle)
                    ? TurnTimer(seconds: 20, battleService: battleService)
                    : const Text('Not your turn')),
        ] else ...[
          Row(
            children: [
              const Text('Waiting for rival '),
              TextButton(
                onPressed: () {
                  battleService.connectAi(battle.id);
                },
                child: const Text('(Play with AI)'),
              ),
            ],
          ),
        ],
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
