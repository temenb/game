import 'package:shared_preferences/shared_preferences.dart';

import '../models/setting.dart';

class SettingService {
  static const _soundKey = 'soundEnabled';
  static const _effectsKey = 'effectsSoundEnabled';
  static const _vibrationKey = 'vibrationEnabled';

  Future<bool> getSoundEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_soundKey) ?? true;
  }

  Future<bool> getEffectsSoundEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_effectsKey) ?? true;
  }

  Future<bool> getVibrationEnabled() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_vibrationKey) ?? true;
  }

  Future<void> setSoundEnabled(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_soundKey, value);
  }

  Future<void> setEffectsSoundEnabled(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_effectsKey, value);
  }

  Future<void> setVibrationEnabled(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_vibrationKey, value);
  }

  Future<Setting> load() async {
    final sound = true;
    final effects = true;
    final vibration = true;
    return Setting(
      soundEnabled: sound,
      effectsSoundEnabled: effects,
      vibrationEnabled: vibration,
    );
  }
}
