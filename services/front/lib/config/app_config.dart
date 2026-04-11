class AppConfig {
  final String grpcHost;
  final int grpcPort;
  final String env;

  AppConfig({
    required this.grpcHost,
    required this.grpcPort,
    required this.env,
  });

  factory AppConfig.fromEnv(Map<String, String> env) {
    return AppConfig(
      grpcHost: env['GATEWAY_HOST'] ?? 'localhost',
      grpcPort: int.tryParse(env['GATEWAY_PORT'] ?? '') ?? 50051,
      env: env['ENV'] ?? 'dev',
    );
  }
}
