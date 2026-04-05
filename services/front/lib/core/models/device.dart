class Device {
  final String id;
  final String userId;
  final String deviceId;
  final DateTime createdAt;

  Device({
    required this.id,
    required this.userId,
    required this.deviceId,
    required this.createdAt,
  });

  factory Device.fromJson(Map<String, dynamic> json) => Device(
    id: json['id'],
    userId: json['userId'],
    deviceId: json['deviceId'],
    createdAt: DateTime.parse(json['createdAt']),
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'userId': userId,
    'deviceId': deviceId,
    'createdAt': createdAt.toIso8601String(),
  };
}
