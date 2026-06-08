import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/profile/params/profile_params.dart';
import 'package:front/src/config/gateway_config.dart';
import 'package:logger/logger.dart';

import '../clients/profile_client.dart';

final logger = Logger();

final profileClientProvider = Provider.family<ProfileClient, ProfileParams>(
  (ref, params) {
    final config = GatewayConfig.fromEnv();

    final profileClient = ProfileClient(params, config);

    return profileClient;
  },
);
