import 'package:flutter/material.dart';
import 'package:front/app_context.dart';
import 'package:front/app_initializer.dart';
import 'package:front/app.dart';
import 'package:front/app_state.dart';
import 'package:front/error_app.dart';
import 'package:front/features/auth/providers/auth_service_provider.dart';
import 'package:logger/logger.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

final logger = Logger();

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();

  final appState = new AppState();

  runApp(MyApp(
    state: appState
  ));

  FlutterError.onError = (FlutterErrorDetails details) {
    FlutterError.dumpErrorToConsole(details); // стандартный вывод
    logger.e(
      'Flutter error',
      error: details.exception,
      stackTrace: details.stack,
    );
  };
}


