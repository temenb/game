import 'dart:async';

import 'package:fixnum/fixnum.dart';
import 'package:front/src/clients/streaming_channel.dart';
import 'package:front/src/grpc/generated/battle.pb.dart' as battleGrpc;
import 'package:front/src/grpc/generated/common/empty.pb.dart';
import 'package:front/src/grpc/generated/common/ping.pb.dart';
import 'package:front/src/grpc/generated/streaming.pb.dart' as streamingGrpc;
import 'package:front/src/grpc/generated/streaming.pb.dart';
import 'package:logger/logger.dart';

final logger = Logger();

class BattleChannel extends StreamingChannel<battleGrpc.BattleObject> {
  late String profileId;
  final pathname = 'battle';

  messageHandler(List<int> message) {
    // logger.i('Received: $message');
    // try {
    //   // final resp = BattleObject.fromBuffer(message);
    //   // _controller.add(resp);
    // } catch (e) {
    //   logger.e('Failed to parse: $e');
    // }

    try {
      final resp = BattleStreamResponse.fromBuffer(message);
      // logger.i(resp);
      if (resp.hasBattle()) {
        final battle = resp.battle;
        // logger.i('before battle added to controller');
        safeAdd(battle);
        // logger.i('battle added to controller');

        // logger.i('battle added to controller');
      } else {
        logger.e(resp);
        logger.e('Battle handling went wrong: $resp');
      }
    } catch (e) {
      logger.e('Failed to parse: $e');
    }
  }

  getWsUri() {
    return Uri.parse(
      'ws://${config.host}:${config.port}/$pathname?token=$jwt&profileId=${this.profileId}',
    );
  }

  BattleChannel(super.config, this.profileId, super.jwt);

  void move(String battleId, int cellIdx) {
    // logger.i('Move event');
    final moveReq = BattleMoveRequest()..cellIdx = cellIdx
      ..battleId = battleId;

    final req = BattleStreamRequest()..move = moveReq;
    // logger.d(req);
    channel.sink.add(req.writeToBuffer());
    // logger.i('Sent profile: $profileId at $cellIdx');
  }

  void leave(String battleId) {
    final req = BattleStreamRequest()..leave = (LeaveBattleRequest()..battleId = battleId);
    // logger.d(req);
    channel.sink.add(req.writeToBuffer());
    // logger.i('Sent profile: $profileId at $cellIdx');
  }

  connectAi(String battleId) {
    // logger.i('Move event');
    final connectAiRequest = streamingGrpc.AiJoinToBattleRequest()
      ..battleId = battleId;

    final req = BattleStreamRequest()..connectAi = connectAiRequest;
    // logger.d(req);
    channel.sink.add(req.writeToBuffer());
    // logger.i('Sent profile: $profileId at $cellIdx');
  }

  start([String? battleId]) {
    final request = streamingGrpc.StartBattleRequest();

    if (battleId != null) {
      request.battleId = battleId;
    }

    final req = BattleStreamRequest()..start = request;
    channel.sink.add(req.writeToBuffer());

    // logger.i('Sent start battle: $battleId');
  }

  Future<void> ping() async {
    final now = DateTime.now().millisecondsSinceEpoch;
    final req = BattleStreamRequest()..ping = (Ping()..timestamp = Int64(now));
    channel.sink.add(req.writeToBuffer());
  }
}
