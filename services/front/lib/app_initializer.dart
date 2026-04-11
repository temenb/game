import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:front/features/auth/services/auth_service.dart';
import 'package:front/app_state.dart';
import 'package:front/app_context.dart';
import 'package:front/features/setting/services/setting_service.dart';
import 'package:front/src/providers/grpc_config_provider.dart';
import 'package:front/src/providers/environment_provider.dart';
import 'package:logger/logger.dart';
import 'package:front/config/app_config.dart';

final logger = Logger();

class AppInitializer {
  static Future<AppContext> initialize() async {

    logger.i("Приложение запущено");   // info
    await dotenv.load(fileName: '.env');



    await dotenv.load(fileName: ".env");

    final config = AppConfig.fromEnv(dotenv.env);





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
    final port = int.tryParse(dotenv.env['GATEWAY_PORT'] ?? '') ?? 50051;
    final config = GrpcConfig(grpcHost: host, grpcPort: port);

    final authService = AuthService();
    authService.initWithConfig(config); // теперь используем правильный метод
    final jwt = await authService.getOrCreateJwt();
    final state = AppState();
    state.setJwt(jwt);

    final settings = SettingService();
    await settings.load();

    // TODO: загрузить сохранённую локализацию
    return AppContext(state: state, settings: settings);
  }
}
