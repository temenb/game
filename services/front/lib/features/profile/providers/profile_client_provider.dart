import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/config/gateway_config.dart';
import 'package:front/src/params/client_params.dart';
import 'package:logger/logger.dart';

import '../clients/profile_client.dart';

final logger = Logger();

final profileClientProvider = Provider.family<ProfileClient, ClientParams>((
  ref,
  params,
) {
  final config = GatewayConfig.fromEnv();

  final profileClient = ProfileClient(params.jwt, config);

  return profileClient;
});
