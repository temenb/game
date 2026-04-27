import 'package:front/main.dart';
import 'package:front/src/grpc/generated/profile.pbgrpc.dart';
import 'package:grpc/grpc.dart';
import 'package:front/src/grpc/generated/profile.pb.dart';
import '../models/profile.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/src/providers/grpc_config_provider.dart';

class ProfileService {
  late final ClientChannel channel;
  late final ProfileClient profileClient;

  ProfileService();

  void init(Ref ref) {
    final config = ref.read(grpcConfigProvider);
    logger.i(config);
    logger.i('Init started with config: $config');
    channel = ClientChannel(
      config.grpcHost,
      port: config.grpcPort,
      options: const ChannelOptions(credentials: ChannelCredentials.insecure()),
    );
    profileClient = ProfileClient(channel);
  }

  Future<Profile> fetchProfile(String profileId) async {
    // return Profile(
    //   id: '1',
    //   name: 'supernickname',
    //   email: '', // email не возвращается, можно добавить в proto при необходимости
    // );

    final request = ViewRequest()..id = profileId;
    final response = await profileClient.view(request);
    return Profile(
      id: response.id,
      name: response.nickname,
      email: '', // email не возвращается, можно добавить в proto при необходимости
    );
  }
}
