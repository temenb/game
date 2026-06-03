import 'dart:async';
import 'package:front/src/clients/streaming_channel.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';
import 'package:front/src/grpc/generated/common/empty.pb.dart';
import 'package:front/src/grpc/generated/engine.pb.dart';
import 'package:front/src/grpc/generated/streaming.pb.dart';
import 'package:logger/logger.dart';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:web_socket_channel/status.dart' as status;

final logger = Logger();

class BattleChannel extends StreamingChannel {
  late WebSocketChannel _channel;
  late StreamController<BattleObject> _controller;
  final pathname = '/battle';


  BattleChannel(super.config, super.jwt) {
    final uri = Uri.parse('ws://${config.host}:${config.port}/$pathname?token=$jwt');
    logger.i('Connecting Channel to $uri');

    _channel = WebSocketChannel.connect(uri);
    _controller = StreamController<BattleObject>.broadcast();

    _channel.stream.listen(
          (message) {
        try {
          // Парсим входящий JSON → BattleObject
          final battle = BattleObject.fromJson(message);
          _controller.add(battle);
          logger.i('Battle update: $battle');
        } catch (e) {
          logger.e('Failed to parse BattleObject: $e');
        }
      },
      onError: (err) => logger.e('BattleChannel error: $err'),
      onDone: () => logger.w('BattleChannel closed'),
    );
  }

  Stream<BattleObject> get battles => _controller.stream;

  /// Отправить событие "join"
  void join() {
    final req = BattleStreamRequest()..join = Empty();
    _channel.sink.add(req.writeToJson());
    logger.i('Sent join event');
  }

  /// Отправить ход
  void move(String battleId, int cellIdx, String userId) {
    final moveReq = BattleMoveRequest()
      ..battleId = battleId
      ..cellIdx = cellIdx
      ..userId = userId;

    final req = BattleStreamRequest()..move = moveReq;
    _channel.sink.add(req.writeToJson());
    logger.i('Sent user: $userId at $cellIdx');
  }

  /// Закрыть канал
  Future<void> close() async {
    await _channel.sink.close(status.normalClosure);
    await _controller.close();
    logger.i('BattleChannel closed');
  }
}
