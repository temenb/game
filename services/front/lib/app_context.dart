import 'package:front/app_state.dart';
import 'package:front/features/setting/services/setting_service.dart';

class AppContext {
  final AppState state;
  final SettingService settings;

  AppContext({required this.state, required this.settings});
}
