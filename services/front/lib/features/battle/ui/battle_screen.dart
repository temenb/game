import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/provider/battle_stream_provider.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';

class BattleScreen extends ConsumerWidget {
  const BattleScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final battleAsync = ref.watch(battleStreamProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Battle: Tic Tac Toe')),
      body: battleAsync.when(
        data: (battle) => _BattleBoard(battle: battle),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Ошибка: $err')),
      ),
    );
  }
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
                  // TODO: отправить ход через battleStreamProvider
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

// ┌────────────────────┐
// │      UI Layer      │
// │  BattleScreen      │
// │  - подписка на     │
// │    battleProvider  │
// │  - вызывает join() │
// └─────────▲──────────┘
// │
// │ Stream<BattleObject>
// │
// ┌─────────┴──────────┐
// │   battleService     │
// │ - методы: join,     │
// │   makeMove, view    │
// │ - хранит Battle     │
// │   состояние         │
// └─────────▲──────────┘
// │
// │
// ┌─────────┴──────────┐
// │   BattleChannel     │
// │ - WebSocket/gRPC    │
// │ - StreamController  │
// │ - battles: Stream   │
// │ - join(): запрос    │
// │   на сервер         │
// └─────────▲──────────┘
// │
// │ ws://host:port?token=jwt
// │
// ┌─────────┴──────────┐
// │   Server Backend    │
// │ - принимает join    │
// │ - рассылает события │
// │   BattleObject      │
// └────────────────────┘
