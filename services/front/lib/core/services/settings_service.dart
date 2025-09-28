// Устаревший сервис настроек перенесён в features/settings/
// Используйте features/settings/settings_service.dart и settings_provider.dart

import 'package:flutter/foundation.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

class SettingsService extends ChangeNotifier {
  static const _soundKey = 'soundEnabled';
  static const _effectsKey = 'effectsSoundEnabled';
  static const _vibrationKey = 'vibrationEnabled';

  bool _soundEnabled = true;
  bool _effectsSoundEnabled = true;
  bool _vibrationEnabled = true;

  bool get soundEnabled => _soundEnabled;
  bool get effectsSoundEnabled => _effectsSoundEnabled;
  bool get vibrationEnabled => _vibrationEnabled;

  Future<void> load() async {
    final prefs = await SharedPreferences.getInstance();
    _soundEnabled = prefs.getBool(_soundKey) ?? true;
    _effectsSoundEnabled = prefs.getBool(_effectsKey) ?? true;
    _vibrationEnabled = prefs.getBool(_vibrationKey) ?? true;
    notifyListeners();
  }

  Future<void> toggleSound(bool value) async {
    _soundEnabled = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_soundKey, value);
    notifyListeners();
  }

  Future<void> toggleEffectsSound(bool value) async {
    _effectsSoundEnabled = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_effectsKey, value);
    notifyListeners();
  }

  Future<void> toggleVibration(bool value) async {
    _vibrationEnabled = value;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_vibrationKey, value);
    notifyListeners();
  }
}

final settingsServiceProvider = Provider<SettingsService>((ref) => SettingsService());
