import 'package:flutter/material.dart';
import 'package:front/app_initializer.dart';
import 'package:front/app.dart';
import 'package:front/error_app.dart';
import 'package:front/core/services/settings_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {
    final context = await AppInitializer.initialize();
    runApp(MyApp(state: context.state, settings: context.settings));
  } catch (e, stack) {
    debugPrint('Ошибка при запуске: $e');
    debugPrint('$stack');
    runApp(ErrorApp(error: e.toString()));
  }
}

