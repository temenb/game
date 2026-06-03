import 'dart:convert';

import 'package:fixnum/fixnum.dart';
import 'package:protobuf/protobuf.dart';

T parseProto<T extends GeneratedMessage>(T Function() creator, String json) {
  final data = jsonDecode(json) as Map<String, dynamic>;
  final obj = creator();
  data.forEach((key, value) {
    final fieldInfo = obj.info_.byName[key];
    if (fieldInfo != null) {
      if (fieldInfo.type == PbFieldType.O3 ||
          fieldInfo.type == PbFieldType.O6) {
        // int32 / int64 → конвертируем
        obj.setField(fieldInfo.tagNumber, Int64(value));
      } else {
        obj.setField(fieldInfo.tagNumber, value);
      }
    }
  });
  return obj;
}
