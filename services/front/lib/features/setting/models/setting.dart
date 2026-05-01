class Setting {
  final bool soundEnabled;
  final bool effectsSoundEnabled;
  final bool vibrationEnabled;

  const Setting({
    required this.soundEnabled,
    required this.effectsSoundEnabled,
    required this.vibrationEnabled,
  });

  Setting copyWith({
    bool? soundEnabled,
    bool? effectsSoundEnabled,
    bool? vibrationEnabled,
  }) {
    return Setting(
      soundEnabled: soundEnabled ?? this.soundEnabled,
      effectsSoundEnabled: effectsSoundEnabled ?? this.effectsSoundEnabled,
      vibrationEnabled: vibrationEnabled ?? this.vibrationEnabled,
    );
  }
}
