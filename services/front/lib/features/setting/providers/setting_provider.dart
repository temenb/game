import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../models/setting.dart';
import '../services/setting_service.dart';

class SettingNotifier extends StateNotifier<Setting> {
  final SettingService _service;

  SettingNotifier(this._service)
    : super(
        const Setting(
          soundEnabled: true,
          effectsSoundEnabled: true,
          vibrationEnabled: true,
        ),
      ) {
    _load();
  }

  Future<void> _load() async {
    final sound = await _service.getSoundEnabled();
    final effects = await _service.getEffectsSoundEnabled();
    final vibration = await _service.getVibrationEnabled();
    state = Setting(
      soundEnabled: sound,
      effectsSoundEnabled: effects,
      vibrationEnabled: vibration,
    );
  }

  Future<void> setSoundEnabled(bool value) async {
    await _service.setSoundEnabled(value);
    state = state.copyWith(soundEnabled: value);
  }

  Future<void> setEffectsSoundEnabled(bool value) async {
    await _service.setEffectsSoundEnabled(value);
    state = state.copyWith(effectsSoundEnabled: value);
  }

  Future<void> setVibrationEnabled(bool value) async {
    await _service.setVibrationEnabled(value);
    state = state.copyWith(vibrationEnabled: value);
  }
}

final settingsProvider = StateNotifierProvider<SettingNotifier, Setting>((ref) {
  final service = SettingService();

  // await service.load();
  return SettingNotifier(service);
});
