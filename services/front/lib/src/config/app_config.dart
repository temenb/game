class AppConfig {
  final String env;
  final int moveTimeout;

  AppConfig({required this.env, required this.moveTimeout});

  factory AppConfig.fromEnv(Map<String, String> env) {
    final _env = env['ENV'] ?? 'dev';
    final moveTimeout = int.tryParse(env['MOVE_TIMEOUT']) ?? 20;
    return AppConfig(env: _env, moveTimeout: moveTimeout);
  }
}
