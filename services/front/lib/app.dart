import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:front/router.dart';
import 'package:front/src/localization/generated/l10n.dart';
import 'package:front/src/providers/locale_provider.dart';
import 'package:front/theme.dart';

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ProviderScope(
      child: Consumer(
        builder: (context, ref, _) {
          // final secureStorage = ref.watch(secureStorageProvider);
          // secureStorage.deleteAll();
          final localeAsync = ref.watch(localeProvider);

          return localeAsync.when(
            data: (locale) => MaterialApp(
              title: 'Front App',
              theme: appTheme,
              locale: Locale(locale),
              localizationsDelegates: [
                S.delegate,
                GlobalMaterialLocalizations.delegate,
                GlobalWidgetsLocalizations.delegate,
                GlobalCupertinoLocalizations.delegate,
              ],
              supportedLocales: S.delegate.supportedLocales,
              initialRoute: '/',
              routes: appRouter,
            ),
            loading: () => const Center(child: CircularProgressIndicator()),
            error: (err, stack) => Center(child: Text('Locale error: $err')),
          );
        },
      ),
    );
  }
}
