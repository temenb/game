import 'dart:async';
import 'dart:io';

import 'package:front/features/battle/params/battle_params.dart';
import 'package:front/src/clients/streaming_channel.dart';
import 'package:front/src/config/streaming_config.dart';
import 'package:front/src/grpc/generated/battle.pb.dart';
import 'package:front/src/grpc/generated/common/empty.pb.dart';
import 'package:front/src/grpc/generated/engine.pb.dart';
import 'package:front/src/grpc/generated/profile.pb.dart';
import 'package:front/src/grpc/generated/streaming.pb.dart';
import 'package:logger/logger.dart';

final logger = Logger();

class BattleChannel extends StreamingChannel<BattleObject> {
  late BattleParams battleParams;
  final pathname = 'battle';

  messageHandler(List<int> message) {
    logger.i('Received: $message');
    // try {
    //   // final resp = BattleObject.fromBuffer(message);
    //   // _controller.add(resp);
    // } catch (e) {
    //   logger.e('Failed to parse: $e');
    // }

    try {
      final resp = BattleStreamResponse.fromBuffer(message);
      logger.i(resp);
      if (resp.hasBattle()) {
        final battle = resp.battle;
        logger.i('before battle added to controller');
        safeAdd(battle);
        logger.i('battle added to controller');

        logger.i('battle added to controller');
      } else {
        logger.e('Battle handling went wrong: battle');
      }
    } catch (e) {
      logger.e('Failed to parse: $e');
    }
  }

  BattleChannel(StreamingConfig config, this.battleParams)
      : super(config, battleParams.jwt);

  /// Отправить событие "join"
  void join(String profileId) {
    logger.i('Join event');
    final joinReq = ProfileIdRequest()..profileId = profileId;
    final req = BattleStreamRequest()..join = joinReq;
    logger.i(req);
    channel.sink.add(req.writeToBuffer());
    logger.i('Sent join event');
  }

  /// Отправить ход
  void move(String profileId, String battleId, int cellIdx) {
    logger.i('Move event');
    final moveReq = BattleMoveRequest()
      ..battleId = battleId
      ..cellIdx = cellIdx
      ..profileId = profileId;

    final req = BattleStreamRequest()..move = moveReq;
    logger.d(req);
    channel.sink.add(req.writeToBuffer());
    logger.i('Sent profile: $profileId at $cellIdx');
  }

  /// Закрыть канал
  Future<void> ping() async {
    final req = BattleStreamRequest()..ping = Empty();
    channel.sink.add(req.writeToBuffer());
  }
}
