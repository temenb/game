class AppConfig {
  final String env;

  AppConfig({
    required this.env,
  });

  factory AppConfig.fromEnv(Map<String, String> env) {
    return AppConfig(
      env: env['ENV'] ?? 'dev',
    );
  }
}
