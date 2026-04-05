class Session {
  final String id;
  final String userId;
  final String accessToken;
  final String refreshToken;
  final DateTime createdAt;
  final DateTime updatedAt;

  Session({
    required this.id,
    required this.userId,
    required this.accessToken,
    required this.refreshToken,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Session.fromJson(Map<String, dynamic> json) => Session(
    id: json['id'],
    userId: json['userId'],
    accessToken: json['accessToken'],
    refreshToken: json['refreshToken'],
    createdAt: DateTime.parse(json['createdAt']),
    updatedAt: DateTime.parse(json['updatedAt']),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'userId': userId,
    'accessToken': accessToken,
    'refreshToken': refreshToken,
    'createdAt': createdAt.toIso8601String(),
    'updatedAt': updatedAt.toIso8601String(),
  };
}
