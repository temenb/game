import 'package:grpc/grpc.dart';
import 'package:front/grpc/generated/gateway.pbgrpc.dart';
import 'package:front/grpc/generated/profile.pb.dart';
import 'package:front/core/models/profile.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/core/provider/config_provider.dart';

class ProfileService {
  late final ClientChannel channel;
  late final GatewayClient gatewayClient;

  ProfileService();

  void init(WidgetRef ref) {
    final config = ref.read(configProvider);
    channel = ClientChannel(
      config.grpcHost,
      port: config.grpcPort,
      options: const ChannelOptions(credentials: ChannelCredentials.insecure()),
    );
    gatewayClient = GatewayClient(channel);
  }

  Future<Profile> fetchProfile(String profileId) async {
    final request = ViewRequest()..profileId = profileId;
    final response = await gatewayClient.viewProfile(request);
    return Profile(
      id: response.profileId,
      name: response.nickname,
      email: '', // email не возвращается, можно добавить в proto при необходимости
    );
  }
}
