class ProfileParams {
  final String jwt;

  ProfileParams(this.jwt);

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is ProfileParams && jwt == other.jwt;

  @override
  int get hashCode => jwt.hashCode;
}
