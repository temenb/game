import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/provider/battle_provider.dart';

class BattleScreen extends ConsumerWidget {
  const BattleScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final board = ref.watch(battleProvider);

    return Scaffold(
      appBar: AppBar(title: const Text("Battle")),
      body: GridView.builder(
        // margin: center,
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 3, // сетка 3x3
          crossAxisSpacing: 8,
          mainAxisSpacing: 8,
        ),
        itemCount: board.length,
        itemBuilder: (context, index) {
          return GestureDetector(
            onTap: () {
              // пример изменения состояния
              ref.read(boardProvider.notifier).update((state) {
                final newBoard = [...state];
                newBoard[index] = newBoard[index].isEmpty ? 'X' : newBoard[index];
                return newBoard;
              });
            },
            child: Container(
              decoration: BoxDecoration(
                border: Border.all(color: Colors.black),
              ),
              child: Center(
                child: Text(
                  board[index],
                  style: const TextStyle(fontSize: 32),
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
