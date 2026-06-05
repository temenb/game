import 'package:front/app_context.dart';
import 'package:front/app_state.dart';
import 'package:front/features/auth/services/auth_service.dart';
import 'package:front/features/setting/services/setting_service.dart';
import 'package:logger/logger.dart';

final logger = Logger();

class AppInitializer {
  static Future<AppContext> initialize(AuthService authService) async {
    logger.i("Приложение запущено"); // info

    // final jwt = await authService.getOrCreateJwt();
    final state = AppState();
    // state.setJwt(jwt);

    final settings = SettingService();
    await settings.load();

    // TODO: загрузить сохранённую локализацию

    return AppContext(state: state, settings: settings);
  }
}
