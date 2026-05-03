import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/battle/provider/battle_service_provider.dart';

import '../models/battle.dart';

final battleProvider = FutureProvider<Battle>((ref) async {
  final service = ref.read(battleServiceProvider); // достаём сервис
  return service.viewBattle(); // например, текущий userId
});
