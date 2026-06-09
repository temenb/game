import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/storages/locale_storage.dart';

final localeProvider = FutureProvider<String>((ref) async {
  final localeStorage = LocaleStorage('en');

  var locale = await localeStorage.readLocale();

  return locale;
});
