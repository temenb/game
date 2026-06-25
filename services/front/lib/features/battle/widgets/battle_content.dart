import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/profile/widgets/player_name.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';

import '../services/battle_service.dart';
import '../widgets/battle_board.dart';

class BattleContent extends ConsumerWidget {
  final BattleObject battle;
  final dynamic profile;
  final BattleService battleService;

  const BattleContent({
    super.key,
    required this.battle,
    required this.profile,
    required this.battleService,
  });

  @override
  Widget build(BuildContext context, WidgetRef ref) {
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
                  this.battleService.channel.start();
                  Navigator.of(context).pop();
                },
                child: const Text("Играть ещё"),
              ),
              TextButton(
                onPressed: () {
                  Navigator.of(context).pop();
                  Navigator.of(context).pushReplacementNamed("/");
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
                  battleService.connectAi(battle.id);
                },
                child: const Text('Play with AI'),
              ),
            ],
          ),
        ),
      );
    }
  }
}
