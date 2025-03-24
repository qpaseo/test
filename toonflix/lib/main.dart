import 'package:flutter/material.dart';

class Player {
  String? name; //있을수도 있고 아닐수도 있고
  
  Player({required this.name});
}

void main() {
  var seo = Player(name: "seo");
  seo.name;
  runApp(App());
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    // TODO: implement build

    //CupertinoApp : ios 버전의 디자인
    //MaterialApp : 구글 버전의 디자인

    //규칙
    //1. 모든 화면은 scaffold를 가지고 있어야 한다.
    //2. 클래스를 만들고 그 끝에는 ,을 작성한다.
    //3. 관례적으로 클래스에서는 내용을 작성후 생성자를 작성한다.

    //사소한 점
    //1.elevation으로 그림자 적용시 shadowColor을 사용하여 그림자의 색을 지정한다.

    return MaterialApp(
      home: Scaffold(
        appBar: AppBar(
          elevation: 0,
          shadowColor: Colors.black,
          centerTitle: false,
          title: Text(
            "hello flutter!",
            style: TextStyle(
              color: Colors.white,
              fontSize: 20,
              fontWeight: FontWeight.bold,
            ),
          ),
          backgroundColor: Colors.blueAccent,
        ),
        body: Center(
          child: Text("Hello wored"),
        ),
      ),
    );
  }
}
