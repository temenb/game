import 'dart:convert';
import 'package:protobuf/protobuf.dart';

T parseProto<T extends GeneratedMessage>(
    T Function() creator, String json) {
  final data = jsonDecode(json) as Map<String, dynamic>;
  final obj = creator();
  data.forEach((key, value) {
    if (obj.info_.byName.containsKey(key)) {
      obj.setField(obj.info_.byName[key]!.tagNumber, value);
    }
  });
  return obj;
}
