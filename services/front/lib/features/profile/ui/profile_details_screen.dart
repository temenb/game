import 'package:flutter/material.dart';
import 'package:front/src/grpc/generated/profile.pb.dart';

class ProfileDetailScreen extends StatelessWidget {
  final ProfileObject profile;

  const ProfileDetailScreen({required this.profile, super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(profile.nickname)),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("ID: ${profile.id}"),
            Text("Уровень: ${profile.level}"),
            Text("Рейтинг: ${profile.rating}"),
            Text("Опыт: ${profile.experience}"),
          ],
        ),
      ),
    );
  }
}
