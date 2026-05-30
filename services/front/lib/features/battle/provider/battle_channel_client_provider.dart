import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/grpc/generated/battle.pbgrpc.dart';
import 'package:grpc/grpc.dart';

class BattleChannelClient {
  final BattleClient _client;
  ClientDuplexStream<ClientEvent, BattleObject>? _stream;

  BattleChannelClient(ClientChannel channel)
      : _client = BattleClient(channel);

  /// Подписка на поток баттла
  Stream<BattleGrpc.BattleObject> streamBattle() {
    _stream = _client.battleChannel();

    return _stream!.map((battleObject) => battleObject);
  }

  /// Отправка хода
  void sendMove(String battleId, int cellIdx, String userId) {
    _stream?.send(BattleGrpc.ClientEvent()
      ..move = (BattleGrpc.MoveEvent()
        ..battleId = battleId
        ..cellIndex = cellIdx
        ..userId = userId));
  }

  /// Отправка join
  void sendJoin() {
    _stream?.send(BattleGrpc.ClientEvent()..join = BattleGrpc.JoinEvent());
  }

  /// Завершение стрима
  void close() {
    _stream?.finish();
  }
}

/// Riverpod provider
final battleChannelClientProvider = Provider<BattleChannelClient>((ref) {
  final channel = ClientChannel(
    'localhost', // или твой backend host
    port: 50051,
    options: const ChannelOptions(credentials: ChannelCredentials.insecure()),
  );
  return BattleChannelClient(channel);
});
