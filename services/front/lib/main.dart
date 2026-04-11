import 'package:flutter/material.dart';
import 'package:front/app_initializer.dart';
import 'package:front/app.dart';
import 'package:front/error_app.dart';
import 'package:logger/logger.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';



final logger = Logger();

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  try {

    final context = await AppInitializer.initialize();

    runApp(
      const ProviderScope(
        child: MyApp(
          state: context.state,
          settings: context.settings,
        ),
      ),
    );
  } catch (e, stack) {
    debugPrint('Start up error: $e');
    debugPrint('$stack');
    runApp(ErrorApp(error: e.toString()));
  }
}
