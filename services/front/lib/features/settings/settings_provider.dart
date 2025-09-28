import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'settings_service.dart';
import 'settings_model.dart';

class SettingsNotifier extends StateNotifier<SettingsState> {
  final SettingsService _service;

  SettingsNotifier(this._service)
      : super(const SettingsState(
          soundEnabled: true,
          effectsSoundEnabled: true,
          vibrationEnabled: true,
        )) {
    _load();
  }

  Future<void> _load() async {
    final sound = await _service.getSoundEnabled();
    final effects = await _service.getEffectsSoundEnabled();
    final vibration = await _service.getVibrationEnabled();
    state = SettingsState(
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

final settingsProvider = StateNotifierProvider<SettingsNotifier, SettingsState>((ref) {
  final service = SettingsService();
  return SettingsNotifier(service);
});

