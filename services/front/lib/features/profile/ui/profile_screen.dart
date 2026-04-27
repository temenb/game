import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

import '../provider/profile_provider.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(profileProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: profileAsync.when(
        data: (profile) => Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('ID: ${profile.id}', style: const TextStyle(fontSize: 18)),
              const SizedBox(height: 8),
              Text('Nickname: ${profile.name}', style: const TextStyle(fontSize: 18)),
            ],
          ),
        ),
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (err, stack) => Center(child: Text('Error: $err')),
      ),
    );
  }
}

//   @override
//   Widget build(BuildContext context, WidgetRef ref) {
//     final profileAsync = ref.watch(profileProvider);
//     return Scaffold(
//       appBar: AppBar(title: const Text('Профиль')),
//       body: profileAsync.when(
//         data: (profile) => Center(
//           child: Column(
//             mainAxisAlignment: MainAxisAlignment.center,
//             children: [
//               Text('Имя: ${profile.name}', style: const TextStyle(fontSize: 20)),
//               const SizedBox(height: 8),
//               Text('Email: ${profile.email}', style: const TextStyle(fontSize: 16)),
//               const SizedBox(height: 24),
//               ElevatedButton(
//                 onPressed: () {}, // TODO: добавить логику выхода
//                 child: const Text('Выйти'),
//               ),
//             ],
//           ),
//         ),
//         loading: () => const Center(child: CircularProgressIndicator()),
//         error: (err, stack) => Center(child: Text('Ошибка: $err')),
//       ),
//     );
//   }
// }
