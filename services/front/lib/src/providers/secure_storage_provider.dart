import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/storages/secure_storage.dart';
import 'package:logger/logger.dart';

final logger = Logger();

final secureStorageProvider = Provider<SecureStorage>((ref) {
  final secureStorage = SecureStorage();

  return secureStorage;
});
