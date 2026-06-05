import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/providers/secure_storage_provider.dart';
import 'package:front/src/providers/token_storage_provider.dart';
import 'package:front/src/storages/locale_storage.dart';
import 'package:logger/logger.dart';

import '../../features/auth/providers/auth_service_provider.dart';

final localeProvider = FutureProvider<String>((ref) async {
  final localeStorage = LocaleStorage('en');

  var locale = await localeStorage.readLocale();

  return locale;
});
