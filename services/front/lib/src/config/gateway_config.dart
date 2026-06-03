import 'package:flutter_dotenv/flutter_dotenv.dart';
// import 'package:front/src/providers/environment_provider.dart';

class GatewayConfig {
  final String host;
  final int port;

  // final Environment env;

  factory GatewayConfig.fromEnv() {
    final host = dotenv.env['GATEWAY_HOST'] ?? 'localhost';
    final port = int.tryParse(dotenv.env['GATEWAY_PORT'] ?? '') ?? 9090;
    return GatewayConfig(host: host, port: port);
  }

  const GatewayConfig({required this.host, required this.port});
}
