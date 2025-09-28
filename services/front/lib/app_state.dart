import 'package:flutter/material.dart';

class AppState extends ChangeNotifier {
  String? jwt;
  Locale locale = const Locale('ru');

  void setJwt(String token) {
    jwt = token;
    notifyListeners();
  }

  void setLocale(Locale newLocale) {
    locale = newLocale;
    notifyListeners();
  }
}
