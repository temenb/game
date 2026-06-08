class BattleParams {
  final String jwt;
  final String profileId;

  BattleParams(this.jwt, this.profileId);

  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
          other is BattleParams &&
              jwt == other.jwt &&
              profileId == other.profileId;

  @override
  int get hashCode => Object.hash(jwt, profileId);
}
