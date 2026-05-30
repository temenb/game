import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/auth/providers/auth_service_provider.dart';
import 'package:front/features/battle/services/battle_service.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';
import 'package:front/src/providers/gateway_client_provider.dart';

final battleStreamProvider = StreamProvider<BattleObject>((ref) {
  final battleChannel = ref.read(battleChannelClientProvider);
  return battleChannel.streamBattle(); // твой gRPC или WebSocket стрим
});

