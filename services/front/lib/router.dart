import 'package:flutter/material.dart';
import 'package:front/features/home/ui/home_screen.dart';
import 'package:front/features/setting/ui/settings_screen.dart';

final appRouter = <String, WidgetBuilder>{
  '/': (context) => const HomeScreen(),
  '/settings': (context) => const SettingsScreen(),
};
