import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/storages/token_storage.dart';
import 'package:logger/logger.dart';

final logger = Logger();

final tokenStorageProvider = Provider<TokenStorage>((ref) {
  final tokenStorage = TokenStorage();

  return tokenStorage;
});
