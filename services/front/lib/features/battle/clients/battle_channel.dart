import 'dart:async';

import 'package:front/src/clients/streaming_channel.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';
import 'package:front/src/grpc/generated/common/empty.pb.dart';
import 'package:front/src/grpc/generated/engine.pb.dart';
import 'package:front/src/grpc/generated/profile.pb.dart';
import 'package:front/src/grpc/generated/streaming.pb.dart';
import 'package:logger/logger.dart';
import 'package:web_socket_channel/status.dart' as status;
import 'package:web_socket_channel/web_socket_channel.dart';

final logger = Logger();

class BattleChannel extends StreamingChannel {
  late WebSocketChannel _channel;
  late StreamController<BattleObject> _controller;
  late String jwt;
  late String profileId;
  final pathname = 'battle';

  messageHandler(List<int> message) {
    logger.i('Received: $message');
    try {
      final resp = BattleStreamResponse.fromBuffer(message);
      if (resp.hasBattle()) {
        final battle = resp.battle;
        _controller.add(battle);
      } else {
        logger.e('Battle handling went wrong: battle');
      }
    } catch (e) {
      logger.e('Failed to parse: $e');
    }
  }

  BattleChannel(super.config, super.jwt) {
  }

  Stream<BattleObject> get battles => _controller.stream;

  /// Отправить событие "join"
  void join(String profileId) {
    final joinReq = ProfileIdRequest()..profileId = profileId;
    final req = BattleStreamRequest()..join = joinReq;
    _channel.sink.add(req.writeToBuffer());
    logger.i('Sent join event');
  }

  /// Отправить ход
  void move(String profileId, String battleId, int cellIdx) {
    final moveReq = BattleMoveRequest()
      ..battleId = battleId
      ..cellIdx = cellIdx
      ..profileId = profileId;

    final req = BattleStreamRequest()..move = moveReq;
    _channel.sink.add(req.writeToBuffer());
    logger.i('Sent profile: $profileId at $cellIdx');
  }

  /// Закрыть канал
  Future<void> close() async {
    await _channel.sink.close(status.normalClosure);
    await _controller.close();
    logger.i('BattleChannel closed');
  }

  Future<void> ping() async {
    final req = BattleStreamRequest()..ping = Empty();
    _channel.sink.add(req.writeToBuffer());
  }
}
