import 'dart:async';

import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/app.dart';
import 'package:logger/logger.dart';

final logger = Logger();

Future<void> main() async {
  // Глобальный перехват ошибок Flutter
  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.dumpErrorToConsole(details); // стандартный вывод
    debugPrint(
      'Flutter error: ${details.exceptionAsString()}\n${details.stack}',
    );
    logger.e(
      'Flutter error',
      error: details.exception,
      stackTrace: details.stack,
    );
  };

  // Глобальный перехват ошибок в асинхронных зонах
  runZonedGuarded(
    () async {
      WidgetsFlutterBinding.ensureInitialized();

      await dotenv.load(fileName: ".env");

      runApp(ProviderScope(child: MyApp()));
    },
    (error, stack) {
      debugPrint('Uncaught async error: $error\n$stack');
      logger.e('Async error', error: error, stackTrace: stack);
    },
  );
}
