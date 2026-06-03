import 'dart:async';

import 'package:front/src/config/streaming_config.dart';
import 'package:logger/logger.dart';
import 'package:web_socket_channel/status.dart' as status;
import 'package:web_socket_channel/web_socket_channel.dart';

final logger = Logger();

class StreamingChannel {
  final StreamingConfig config;
  late WebSocketChannel _channel;
  late StreamSubscription _subscription;
  final String jwt;
  final pathname = '';

  final _controller = StreamController<String>.broadcast();

  StreamingChannel(this.config, this.jwt) {
    final uri = Uri.parse(
      'ws://${config.host}:${config.port}/$pathname?token=$jwt',
    );
    logger.i('Connecting to $uri');
    _channel = WebSocketChannel.connect(uri);

    _subscription = _channel.stream.listen(
      (message) {
        logger.i('Received: $message');
        _controller.add(message);
      },
      onError: (error) {
        logger.e('WebSocket error: $error');
      },
      onDone: () {
        logger.w('WebSocket closed');
      },
    );
  }

  /// Stream of incoming messages
  Stream<String> get messages => _controller.stream;

  /// Send a message to the server
  void send(String message) {
    logger.i('Sending: $message');
    _channel.sink.add(message);
  }

  /// Close connection
  Future<void> close() async {
    await _subscription.cancel();
    await _channel.sink.close(status.normalClosure);
    await _controller.close();
    logger.i('WebSocket connection closed');
  }
}
