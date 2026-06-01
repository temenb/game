import 'dart:convert';
import 'package:http/http.dart' as http;

class GatewayClient {
  final String baseUrl;

  GatewayClient(this.baseUrl);

  Future<Map<String, dynamic>> anonymousSignIn(String deviceId) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/anonymousSignIn'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'deviceId': deviceId}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception("❌ Anonymous sign-in failed: ${response.body}");
    }
  }

  Future<Map<String, dynamic>> refreshTokens(String refreshToken) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/refreshTokens'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'token': refreshToken}),
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body) as Map<String, dynamic>;
    } else {
      throw Exception("❌ Refresh token failed: ${response.body}");
    }
  }
}
