import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/core/provider/environment_provider.dart';

class AppConfig {
  final String grpcHost;
  final int grpcPort;
  final Environment env;

  const AppConfig({
    required this.grpcHost,
    required this.grpcPort,
    required this.env,
  });

  bool get isProd => env == Environment.prod;
  bool get isDev => env == Environment.dev;
}

final configProvider = Provider<AppConfig>((ref) {
  final host = dotenv.env['GATEWAY_HOST'] ?? 'localhost';
  final port = int.tryParse(dotenv.env['GATEWAY_PORT'] ?? '') ?? 50051;
  final env = ref.watch(environmentProvider);
  return AppConfig(grpcHost: host, grpcPort: port, env: env);
});
