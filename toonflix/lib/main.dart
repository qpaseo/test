import 'package:flutter/material.dart';

void main() {
  runApp(App());
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build
    //CupertinoApp : ios 버전의 디자인
    //MaterialApp : 구글 버전의 디자인
    //규칙 : scaffold를 가지고 있어야 한다
    return MaterialApp(
      home: Text('hello world'),
    );
  }
}
