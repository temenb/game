class BattleScreen extends ConsumerWidget {
  const BattleScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final battleAsync = ref.watch(battleStreamProvider);

    return Scaffold(
      appBar: AppBar(title: const Text("Battle")),
      body: battleAsync.when(
        data: (battle) => GridView.builder(
          padding: const EdgeInsets.all(16),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 3,
            crossAxisSpacing: 8,
            mainAxisSpacing: 8,
          ),
          itemCount: battle.cells.length,
          itemBuilder: (context, index) {
            final cellValue = battle.cells[index];
            String symbol = cellValue == 1
                ? "X"
                : cellValue == 2
                ? "O"
                : "";

            return GestureDetector(
              onTap: () {
                ref.read(battleChannelClientProvider)
                    .sendMove(battle.id, index);
              },
              child: Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.black),
                ),
                child: Center(
                  child: Text(symbol, style: const TextStyle(fontSize: 32)),
                ),
              ),
            );
          },
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text("Ошибка: $e")),
      ),
    );
  }
}
