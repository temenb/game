export 'settings_model.dart';
export 'settings_provider.dart';
export 'settings_service.dart';
export 'settings_screen.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'settings_provider.dart';

class SettingsScreen extends ConsumerWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final settings = ref.watch(settingsProvider);
    final notifier = ref.read(settingsProvider.notifier);

    return Scaffold(
      appBar: AppBar(title: const Text('Настройки')),
      body: Column(
        children: [
          SwitchListTile(
            title: const Text('Звук'),
            value: settings.soundEnabled,
            onChanged: notifier.setSoundEnabled,
          ),
          SwitchListTile(
            title: const Text('Эффекты'),
            value: settings.effectsSoundEnabled,
            onChanged: notifier.setEffectsSoundEnabled,
          ),
          SwitchListTile(
            title: const Text('Вибрация'),
            value: settings.vibrationEnabled,
            onChanged: notifier.setVibrationEnabled,
          ),
        ],
      ),
    );
  }
}

