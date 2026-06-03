import 'package:flutter_dotenv/flutter_dotenv.dart';

class StreamingConfig {
  final String host;
  final int port;

  // final Environment env;

  factory StreamingConfig.fromEnv() {
    final host = dotenv.env['STREAMING_HOST'] ?? 'localhost';
    final port = int.tryParse(dotenv.env['STREAMING_PORT'] ?? '') ?? 8080;
    return StreamingConfig(host: host, port: port);
  }

  const StreamingConfig({required this.host, required this.port});
}
