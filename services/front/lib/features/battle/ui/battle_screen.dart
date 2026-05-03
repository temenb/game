import 'package:flutter/material.dart';

class BattleScreen extends StatefulWidget {
  const BattleScreen({super.key});

  @override
  State<BattleScreen> createState() => _BattleScreenState();
}

class _BattleScreenState extends State<BattleScreen> {
  String currentPlayer = 'X';

  void _handleTap(int index) {
    if (board[index].isEmpty) {
      setState(() {
        board[index] = currentPlayer;
        currentPlayer = currentPlayer == 'X' ? 'O' : 'X';
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,
      appBar: AppBar(title: const Text('Крестики-нолики'), centerTitle: true),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(24.0), // отступ вокруг поля
          child: AspectRatio(
            aspectRatio: 1,
            child: Stack(
              children: [
                // линии сетки
                CustomPaint(size: Size.infinite, painter: _BoardPainter()),
                // клетки
                GridView.builder(
                  physics: const NeverScrollableScrollPhysics(),
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 3,
                  ),
                  itemCount: 9,
                  itemBuilder: (context, index) {
                    return GestureDetector(
                      onTap: () => _handleTap(index),
                      child: Container(
                        color: Colors.transparent, // важно для кликов!
                        child: Center(
                          child: AnimatedSwitcher(
                            duration: const Duration(milliseconds: 300),
                            child: Text(
                              board[index],
                              key: ValueKey(board[index]),
                              style: TextStyle(
                                fontSize: 64,
                                fontWeight: FontWeight.bold,
                                color: board[index] == 'X'
                                    ? Colors.redAccent
                                    : Colors.blueAccent,
                              ),
                            ),
                          ),
                        ),
                      ),
                    );
                  },
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class _BoardPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.black
      ..strokeWidth = 4;

    final cellSize = size.width / 3;

    // вертикальные линии
    canvas.drawLine(Offset(cellSize, 0), Offset(cellSize, size.height), paint);
    canvas.drawLine(
      Offset(2 * cellSize, 0),
      Offset(2 * cellSize, size.height),
      paint,
    );

    // горизонтальные линии
    canvas.drawLine(Offset(0, cellSize), Offset(size.width, cellSize), paint);
    canvas.drawLine(
      Offset(0, 2 * cellSize),
      Offset(size.width, 2 * cellSize),
      paint,
    );
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
