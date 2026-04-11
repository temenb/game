import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
// import 'package:front/src/providers/environment_provider.dart';

class GrpcConfig {
  final String grpcHost;
  final int grpcPort;
  // final Environment env;

  const GrpcConfig({
    required this.grpcHost,
    required this.grpcPort,
    // required this.env,
  });
}

final grpcConfigProvider = Provider<GrpcConfig>((ref) {
  final host = dotenv.env['GATEWAY_HOST'] ?? 'localhost';
  final port = int.tryParse(dotenv.env['GATEWAY_PORT'] ?? '') ?? 50051;
  return GrpcConfig(grpcHost: host, grpcPort: port);
});
