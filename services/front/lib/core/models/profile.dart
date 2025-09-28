class Profile {
  final String id;
  final String name;
  final String email;

  Profile({required this.id, required this.name, required this.email});

  factory Profile.fromJson(Map<String, dynamic> json) {
    return Profile(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      email: json['email'] ?? '',
    );
  }
}

