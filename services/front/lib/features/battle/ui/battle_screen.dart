import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/profile/providers/my_profile_provider.dart';
import 'package:front/features/profile/widgets/player_name.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';
import 'package:front/src/params/client_params.dart';
import 'package:front/src/providers/jwt_provider.dart';

import '../../battle/params/battle_params.dart';
import '../../battle/providers/battle_service_provider.dart';
import '../../battle/providers/battle_stream_provider.dart';
import '../../battle/services/battle_service.dart';
import '../../battle/widgets/battle_board.dart';

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

                    if (battle.players.length > 1) {
                      try {
                        return Scaffold(
                          appBar: AppBar(
                            title: const Text('Battle: Tic Tac Toe'),
                          ),
                          body: BattleBoard(
                            battle: battle,
                            profile: profile,
                            battleService: battleService,
                          ),
                        );
                      } catch (e, st) {
                        debugPrint("UI error: $e\n$st");
                        return Text("UI error: ${e.toString()}");
                      }
                    } else {
                      return Scaffold(
                        appBar: AppBar(
                          title: const Text('Battle: Tic Tac Toe'),
                        ),
                        body: Center(
                          child: Column(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const CircularProgressIndicator(),
                              const SizedBox(height: 16),
                              const Text('Waiting for rival...'),
                              const SizedBox(height: 24),
                              ElevatedButton(
                                onPressed: () {
                                  // Запуск игры против AI
                                  battleService.connectAi(battle.id);
                                },
                                child: const Text('Play with AI'),
                              ),
                            ],
                          ),
                        ),
                      );
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
