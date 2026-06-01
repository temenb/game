import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../clients/profile_client.dart';
import 'package:front/src/config/gateway_config.dart';
import 'package:logger/logger.dart';

final logger = Logger();

final profileClientProvider = Provider<ProfileClient>((ref) {
  final config = GatewayConfig.fromEnv();

  final profileClient = ProfileClient(config.host, config.port);

  return profileClient;
});
