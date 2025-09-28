import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

enum Environment { dev, staging, prod }

final environmentProvider = Provider<Environment>((ref) {
  final env = dotenv.env['ENV'] ?? 'dev';
  switch (env) {
    case 'prod':
      return Environment.prod;
    case 'staging':
      return Environment.staging;
    default:
      return Environment.dev;
  }
});

