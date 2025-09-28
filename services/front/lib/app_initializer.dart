import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:front/core/services/auth_service.dart';
import 'package:front/app_state.dart';
import 'package:front/app_context.dart';
import 'package:front/core/services/settings_service.dart';
import 'package:front/core/provider/config_provider.dart';
import 'package:front/core/provider/environment_provider.dart';

class AppInitializer {
  static Future<AppContext> initialize() async {
    await dotenv.load(fileName: '.env');

    final env = dotenv.env['ENV'] ?? 'dev';
    Environment environment;
    switch (env) {
      case 'prod':
        environment = Environment.prod;
        break;
      case 'staging':
        environment = Environment.staging;
        break;
      default:
        environment = Environment.dev;
    }
    final host = dotenv.env['GATEWAY_HOST'];
    if (host == null || host.isEmpty) {
      throw Exception('GATEWAY_HOST не задан в .env!');
    }
    final port = int.tryParse(dotenv.env['GATEWAY_PORT'] ?? '') ?? 3000;
    final config = AppConfig(grpcHost: host, grpcPort: port, env: environment);

    final authService = AuthService();
    authService.initWithConfig(config); // теперь используем правильный метод
    final jwt = await authService.getOrCreateJwt();
    final state = AppState();
    state.setJwt(jwt);

    final settings = SettingsService();
    await settings.load();

    // TODO: загрузить сохранённую локализацию
    return AppContext(state: state, settings: settings);
  }
}
