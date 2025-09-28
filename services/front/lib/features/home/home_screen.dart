import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/core/localization/generated/l10n.dart';
import 'package:front/features/settings/settings_provider.dart';
import 'package:front/features/settings/settings_screen.dart';

class HomeScreen extends ConsumerStatefulWidget {
  const HomeScreen({super.key});

  @override
  ConsumerState<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends ConsumerState<HomeScreen> {
  String _currentLocaleCode = 'ru';

  void _showProfileDialog(BuildContext context) {
    Navigator.pushNamed(context, '/profile');
  }

  void _handleLocaleChange(BuildContext context, String code) {
    Locale newLocale;
    switch (code) {
      case 'ru':
        newLocale = const Locale('ru');
        break;
      case 'ua':
        newLocale = const Locale('uk');
        break;
      case 'us':
        newLocale = const Locale('en');
        break;
      default:
        newLocale = const Locale('en');
    }
    S.load(newLocale);
    setState(() {
      _currentLocaleCode = code;
    });
  }

  void _handleMenuSelection(BuildContext context, String value) {
    switch (value) {
      case 'settings':
        Navigator.pushNamed(context, '/settings');
        break;
      case 'google':
        // TODO: авторизация через Google
        break;
      case 'facebook':
        // TODO: авторизация через Facebook
        break;
    }
  }

  @override
  Widget build(BuildContext context) {
    final settings = ref.watch(settingsProvider);
    final notifier = ref.read(settingsProvider.notifier);

    return Scaffold(
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.person),
          onPressed: () => _showProfileDialog(context),
        ),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 12),
            child: DropdownButtonHideUnderline(
              child: DropdownButton<String>(
                value: _currentLocaleCode,
                icon: const Icon(Icons.language, color: Colors.white),
                dropdownColor: Colors.grey[900],
                style: const TextStyle(color: Colors.white),
                onChanged: (String? newValue) {
                  if (newValue != null) {
                    _handleLocaleChange(context, newValue);
                  }
                },
                items: const [
                  DropdownMenuItem(value: 'ru', child: Text('🇷🇺')),
                  DropdownMenuItem(value: 'ua', child: Text('🇺🇦')),
                  DropdownMenuItem(value: 'us', child: Text('🇺🇸')),
                ],
              ),
            ),
          ),
          PopupMenuButton<String>(
            icon: const Icon(Icons.menu),
            itemBuilder: (context) => [
              const PopupMenuItem(value: 'settings', child: Text('⚙️ Настройки')),
              const PopupMenuDivider(),
              const PopupMenuItem(value: 'google', child: Text('🔐 Войти через Google')),
              const PopupMenuItem(value: 'facebook', child: Text('🔐 Войти через Facebook')),
            ],
            onSelected: (value) => _handleMenuSelection(context, value),
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const SizedBox(height: 40),
            ElevatedButton(
              onPressed: () {
                // TODO: переход к игровому экрану
              },
              style: ElevatedButton.styleFrom(
                shape: const CircleBorder(),
                padding: const EdgeInsets.all(60),
              ),
              child: Text(
                S.of(context).play,
                style: const TextStyle(fontSize: 24),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
