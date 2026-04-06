import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:uuid/uuid.dart';

final deviceServiceProvider = Provider<DeviceService>((ref) => DeviceService());

class DeviceService {
  static const _key = 'deviceId';
  static final _uuid = const Uuid();

  static String? _cached;

  static Future<String> getDeviceId() async {
    if (_cached != null) return _cached!;

    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getString(_key);

    if (stored != null) {
      _cached = stored;
      return stored;
    }

    final generated = _uuid.v4();
    await prefs.setString(_key, generated);
    _cached = generated;
    return generated;
  }
}
