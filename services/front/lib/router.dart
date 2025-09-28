import 'package:flutter/material.dart';
import 'package:front/features/home/home_screen.dart';
import 'package:front/features/settings/settings_screen.dart';

final appRouter = <String, WidgetBuilder>{
  '/': (context) => const HomeScreen(),
  '/settings': (context) => const SettingsScreen(),
};
