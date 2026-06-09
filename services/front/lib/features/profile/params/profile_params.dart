import 'package:front/src/params/client_params.dart';

class ProfileParams {
  final ClientParams clientParams;
  final String profileId;

  ProfileParams(this.clientParams, this.profileId);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is ProfileParams &&
          profileId == other.profileId &&
          clientParams == other.clientParams;

  @override
  int get hashCode => Object.hash(profileId, clientParams);
}
