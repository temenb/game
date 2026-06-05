import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/app_initializer.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';

import '../../auth/providers/auth_service_provider.dart';
import '../../battle/providers/battle_stream_provider.dart';
import '../../profile/providers/profile_provider.dart';

class BattleScreen extends ConsumerWidget {
  const BattleScreen({super.key});

  @override

  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(profileProvider);

    return profileAsync.when(
      data: (profile) {
        debugPrint("Profile state: $profileAsync");
        final battleAsync = ref.watch(battleStreamProvider(BattleParams(profile.id)));

        return Scaffold(
          appBar: AppBar(title: const Text('Battle: Tic Tac Toe'))
        );

        // return battleAsync.when(
        //   data: (battle) {
        //     debugPrint("Battle state: $battle");
        //     return Scaffold(
        //       appBar: AppBar(title: const Text('Battle: Tic Tac Toe')),
        //       body: _BattleBoard(battle: battle),
        //     );
        //   },
        //   loading: () => const Center(child: CircularProgressIndicator()),
        //   error: (err, stack) => Center(child: Text('Ошибка: $err')),
        // );

      },
      loading: () => const Center(child: CircularProgressIndicator()),
      error: (e, _) => Text("Auth error: $e"),
    );
  }




  // Widget build(BuildContext context, WidgetRef ref) {
  //   final profileAsync = ref.watch(profileProvider);
  //
  //   return profileAsync.when(
  //     data: (profile) {
  //       debugPrint("Profile state: $profileAsync");
  //
  //       final authAsync = ref.watch(authServiceProvider);
  //
  //       return authAsync.when(
  //         data: (authService) {
  //           debugPrint("Auth state: $authAsync");
  //
  //           logger.e('test');
  //           final battleAsync = ref.watch(
  //             battleStreamProvider(BattleParams(profile.id)),
  //           );
  //
  //           return battleAsync.when(
  //             data: (battle) {
  //               debugPrint("Battle state: $battle");
  //               return Scaffold(
  //                 appBar: AppBar(title: const Text('Battle: Tic Tac Toe')),
  //                 body: _BattleBoard(battle: battle),
  //               );
  //             },
  //             loading: () => const Center(child: CircularProgressIndicator()),
  //             error: (err, stack) => Center(child: Text('Ошибка: $err')),
  //           );
  //
  //         },
  //         loading: () => const Center(child: CircularProgressIndicator()),
  //         error: (e, _) => Text("Auth error: $e"),
  //       );
  //     },
  //     loading: () => const Center(child: CircularProgressIndicator()),
  //     error: (e, _) => Text("Profile error: $e"),
  //   );
  // }
}

class _BattleBoard extends StatelessWidget {
  final BattleObject battle;

  const _BattleBoard({required this.battle});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Text('Игроки: ${battle.players.join(" vs ")}'),
        Text('Статус: ${battle.status}'),
        if (battle.winner.isNotEmpty) Text('Победитель: ${battle.winner}'),
        const SizedBox(height: 16),
        Expanded(
          child: GridView.builder(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 3,
            ),
            itemCount: 9,
            itemBuilder: (context, index) {
              final cellValue = battle.cells[index];
              return GestureDetector(
                onTap: () {
                  // ref.read(battleStreamProvider(BattleParams(profile.id)).notifier)
                  //   .sendMove(index);
                },
                child: Container(
                  margin: const EdgeInsets.all(4),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.black),
                  ),
                  child: Center(
                    child: Text(
                      _renderCell(cellValue),
                      style: const TextStyle(fontSize: 32),
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
