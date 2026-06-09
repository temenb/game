class ClientParams {
  final String jwt;

  ClientParams(this.jwt);

  @override
  bool operator ==(Object other) =>
      identical(this, other) || other is ClientParams && jwt == other.jwt;

  @override
  int get hashCode => jwt.hashCode;
}
