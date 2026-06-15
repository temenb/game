import 'package:flutter/material.dart';
import 'package:front/features/battle/services/battle_service.dart';
import 'package:front/features/profile/widgets/player_name.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';
import 'package:front/src/grpc/generated/profile.pb.dart';
import 'package:front/widgets/turn_timer.dart';

class BattleBoard extends StatelessWidget {
  final BattleObject battle;
  final BattleService battleService;

  // final ProfileService profileService;
  final ProfileObject profile;

  // final WidgetRef ref;

  const BattleBoard({
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
                  ? TurnTimer(seconds: 2000, battleService: battleService)
                  : const Text('Not your turn')),

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
