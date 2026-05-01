class User {
  final String id;
  final String email;
  final String? passwordHash;
  final String? googleId;
  final DateTime? lastLoginAt;
  final DateTime? lastActiveAt;
  final DateTime createdAt;
  final DateTime updatedAt;

  User({
    required this.id,
    required this.email,
    this.passwordHash,
    this.googleId,
    this.lastLoginAt,
    this.lastActiveAt,
    required this.createdAt,
    required this.updatedAt,
  });

  factory User.fromJson(Map<String, dynamic> json) => User(
    id: json['id'],
    email: json['email'],
    passwordHash: json['passwordHash'],
    googleId: json['googleId'],
    lastLoginAt: json['lastLoginAt'] != null
        ? DateTime.parse(json['lastLoginAt'])
        : null,
    lastActiveAt: json['lastActiveAt'] != null
        ? DateTime.parse(json['lastActiveAt'])
        : null,
    createdAt: DateTime.parse(json['createdAt']),
    updatedAt: DateTime.parse(json['updatedAt']),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'email': email,
    'passwordHash': passwordHash,
    'googleId': googleId,
    'lastLoginAt': lastLoginAt?.toIso8601String(),
    'lastActiveAt': lastActiveAt?.toIso8601String(),
    'createdAt': createdAt.toIso8601String(),
    'updatedAt': updatedAt.toIso8601String(),
  };
}
