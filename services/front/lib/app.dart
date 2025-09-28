import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/app_state.dart';
import 'package:front/core/services/settings_service.dart';
import 'package:front/features/home/home_screen.dart';
import 'package:front/features/settings/settings_screen.dart';
import 'package:front/features/profile/profile_screen.dart';
import 'package:front/theme.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:front/core/localization/generated/l10n.dart';

class MyApp extends StatelessWidget {
  final AppState state;
  final SettingsService settings;

  const MyApp({required this.state, required this.settings, super.key});

  @override
  Widget build(BuildContext context) {
    return ProviderScope(
      child: MaterialApp(
        title: 'Front App',
        theme: appTheme,
        locale: state.locale,
        localizationsDelegates: [
          S.delegate,
          GlobalMaterialLocalizations.delegate,
          GlobalWidgetsLocalizations.delegate,
          GlobalCupertinoLocalizations.delegate,
        ],
        supportedLocales: S.delegate.supportedLocales,
        routes: {
          '/': (context) => const HomeScreen(),
          '/settings': (context) => SettingsScreen(),
          '/profile': (context) => const ProfileScreen(),
        },
      ),
    );
  }
}
