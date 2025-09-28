class SettingsState {
  final bool soundEnabled;
  final bool effectsSoundEnabled;
  final bool vibrationEnabled;

  const SettingsState({
    required this.soundEnabled,
    required this.effectsSoundEnabled,
    required this.vibrationEnabled,
  });

  SettingsState copyWith({
    bool? soundEnabled,
    bool? effectsSoundEnabled,
    bool? vibrationEnabled,
  }) {
    return SettingsState(
      soundEnabled: soundEnabled ?? this.soundEnabled,
      effectsSoundEnabled: effectsSoundEnabled ?? this.effectsSoundEnabled,
      vibrationEnabled: vibrationEnabled ?? this.vibrationEnabled,
    );
  }
}

