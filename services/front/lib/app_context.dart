import 'package:front/app_state.dart';
import 'package:front/core/services/settings_service.dart';

class AppContext {
  final AppState state;
  final SettingsService settings;

  AppContext({required this.state, required this.settings});
}
