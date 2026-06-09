import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/profile/params/profile_params.dart';
import 'package:front/features/profile/providers/profile_provider.dart';
import 'package:front/features/profile/ui/profile_details_screen.dart';
import 'package:front/src/params/client_params.dart';
import 'package:front/src/providers/jwt_provider.dart';

class PlayerName extends ConsumerWidget {
  final String profileId;

  const PlayerName({required this.profileId, super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final jwtAsync = ref.watch(jwtProvider);

    return jwtAsync.when(
      data: (jwt) {
        final profileParams = ProfileParams(ClientParams(jwt), profileId);
        final profileAsync = ref.watch(profileProvider(profileParams));

        return profileAsync.when(
          data: (profile) {
            return GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => ProfileDetailScreen(profile: profile),
                  ),
                );
              },
              child: Text(
                profile.nickname,
                style: const TextStyle(
                  fontSize: 16,
                  color: Colors.blue, // выделим кликабельность
                  decoration: TextDecoration.underline,
                ),
              ),
            );
          },
          loading: () => const Text("Загрузка..."),
          error: (err, _) => Text("Ошибка: $err"),
        );
      },
      loading: () => const Text("Auth..."),
      error: (err, _) => Text("Auth error: $err"),
    );
  }
}
