import 'dart:async';

import 'package:front/src/config/streaming_config.dart';
import 'package:logger/logger.dart';
import 'package:web_socket_channel/status.dart' as status;
import 'package:web_socket_channel/web_socket_channel.dart';

final logger = Logger();

abstract class StreamingChannel {
  final StreamingConfig config;
  late WebSocketChannel _channel;
  late StreamSubscription _subscription;
  Timer? _heartbeat;
  final String jwt;
  final pathname = '';
  final heartbeatTimer = 30;

  final _controller = StreamController<String>.broadcast();

  messageHandler(String message) {
    logger.i('Received: $message');
    try {
      // final resp = BattleObject.fromBuffer(message);
      // _controller.add(resp);
    } catch (e) {
      logger.e('Failed to parse: $e');
    }
  }

  connect() {
    final uri = Uri.parse(
      'ws://${config.host}:${config.port}/$pathname?token=$jwt',
    );
    logger.i('Connecting to $uri');
    _channel = WebSocketChannel.connect(uri);

    _subscription = _channel.stream.listen(
      (message) => messageHandler(message),
      onError: (error) {
        logger.e('WebSocket error: $error');
      },
      onDone: () {
        logger.w('WebSocket closed');
      },
    );

    _heartbeat = Timer.periodic(
      Duration(seconds: heartbeatTimer),
      (_) => ping(),
    );
  }

  StreamingChannel(this.config, this.jwt) {
    connect();
  }

  Stream<String> get messages => _controller.stream;

  void send(String message) {
    logger.i('Sending: $message');
    _channel.sink.add(message);
  }

  void ping() {
    // final req = BattleStreamRequest()..ping = Empty();
    // _channel.sink.add(req.writeToBuffer());
  }

  Future<void> close() async {
    await _subscription.cancel();
    await _channel.sink.close(status.normalClosure);
    await _controller.close();
    _heartbeat?.cancel();
    logger.i('WebSocket connection closed');
  }
}
