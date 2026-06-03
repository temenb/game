import 'dart:convert';

import 'package:front/src/config/gateway_config.dart';
import 'package:http/http.dart' as http;

class GatewayClient {
  final String baseUrl;
  final int port;
  final GatewayConfig config;

  GatewayClient(this.config) : baseUrl = config.host, port = config.port;

  Uri buildUri(String path) {
    return Uri.parse('http://$baseUrl:$port$path');
  }

  Future<String> post(
    String path,
    Map<String, dynamic> body, {
    Map<String, String>? headers,
  }) async {
    final response = await http.post(
      buildUri(path),
      headers: {
        'Content-Type': 'application/json',
        ...?headers, // добавляем кастомные заголовки
      },
      body: jsonEncode(body),
    );

    if (response.statusCode == 200) {
      return response.body;
    } else {
      throw Exception("❌ POST $path failed: ${response.body}");
    }
  }

  Future<String> get(String path, {Map<String, String>? headers}) async {
    final response = await http.get(
      buildUri(path),
      headers: {'Content-Type': 'application/json', ...?headers},
    );

    if (response.statusCode == 200) {
      return response.body;
    } else {
      throw Exception("❌ GET $path failed: ${response.body}");
    }
  }
}
