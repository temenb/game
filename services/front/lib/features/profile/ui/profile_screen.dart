import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/features/profile/providers/my_profile_provider.dart';
import 'package:front/src/params/client_params.dart';
import 'package:front/src/providers/jwt_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final jwtAsync = ref.watch(jwtProvider);

    return jwtAsync.when(
      data: (jwt) {
        final clientParams = ClientParams(jwt);
        final profileAsync = ref.watch(myProfileProvider(clientParams));

        return Scaffold(
          appBar: AppBar(title: const Text('Profile')),
          body: profileAsync.when(
            data: (profile) => Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'ID: ${profile.id}',
                    style: const TextStyle(fontSize: 18),
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Nickname: ${profile.nickname}',
                    style: const TextStyle(fontSize: 18),
                  ),
                ],
              ),
            ),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (err, stack) => Center(child: Text('Error: $err')),
          ),
        );
      },
      loading: () => const CircularProgressIndicator(),
      error: (err, st) => Text("JWT error: $err"),
    );
  }
}
