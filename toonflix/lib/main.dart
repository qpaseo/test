import 'package:flutter/material.dart';
import 'package:toonflix/widgets/Button.dart';
import 'package:toonflix/widgets/currency_card.dart';

class Player {
  String? name; //있을수도 있고 아닐수도 있고

  Player({required this.name});
}

void main() {
  var seo = Player(name: "seo");
  seo.name;
  runApp(App());
}

//StatefulWidget : 변하는 데이터가 있는 화면
//StatelessWidget : 변하는 데이터가 없는 화면

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  int counter = 0;

  @override
  void onClicked() {
    //변경된 데이터 적용(StatefulWidget, build다시 실행)
    setState(() {
      counter += 1;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Scaffold(
        backgroundColor: Colors.white,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                "clock count",
                style: TextStyle(fontSize: 30),
              ),
              Text(
                counter.toString(),
                style: TextStyle(fontSize: 30),
              ), // 정수를 문자열로 변환하여 사용
              IconButton(
                iconSize: 40,
                onPressed: onClicked,
                icon: Icon(Icons.add_box_rounded),
              )
            ],
          ),
        ),
      ),
    );
  }
}
