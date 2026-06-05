import './secure_storage.dart';

class LocaleStorage extends SecureStorage {
  final _localeKey = 'locale';
  String? _locale;
  final defaultLocale;

  LocaleStorage(this.defaultLocale);

  Future<void> saveLocale(String locale) async {
    _locale = locale;
    await save(this._localeKey, locale);
  }

  Future<String> readLocale() async {
    if (_locale != null && _locale!.isNotEmpty) {
      return _locale!;
    }

    _locale = await read(_localeKey);

    if (_locale != null && _locale!.isNotEmpty) {
      return _locale!;
    }

    return defaultLocale;
  }

  Future<void> deleteLocale() async {
    _locale = null;
    return await delete(this._localeKey);
  }

  Future<void> clearAll() async {
    await deleteLocale();
  }
}
