import 'package:flutter/material.dart';
import 'package:toonflix/widgets/Button.dart';
import 'package:toonflix/widgets/currency_card.dart';

class Player {
  String? name; //있을수도 있고 아닐수도 있고

  Player({required this.name});
}

void main() {
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
  bool showTitle = true;

  void toggleTitle() {
    //해당 위젯을 다시 빌드
    //최소한의 구역에서만 사용
    //StatefulWidget에서만 사용

    setState(() {
      showTitle = !showTitle;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      theme: ThemeData(
        textTheme: TextTheme(
          titleLarge: TextStyle(
            color: Colors.red,
          ),
        ),
      ),
      home: Scaffold(
        backgroundColor: Colors.white,
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              showTitle ? MyLargeTitle() : const Text('notthing'),
              IconButton(
                  onPressed: toggleTitle, icon: Icon(Icons.remove_red_eye))
            ],
          ),
        ),
      ),
    );
  }
}

class MyLargeTitle extends StatefulWidget {
  const MyLargeTitle({
    super.key,
  });

  @override
  State<MyLargeTitle> createState() => _MyLargeTitleState();
}

class _MyLargeTitleState extends State<MyLargeTitle> {
  int count = 0;

  //initState : state초기화
  //build보다 먼저 있어야 함
  //의존성 배열 없는 useEffect
  @override
  void initState() {
    super.initState();
  }

  //Widget이 정리될때 사용
  //클린업 함수
  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Text(
      "My Large Title",
      style: TextStyle(
        fontSize: 30,
        color: Theme.of(context).textTheme.titleLarge?.color,
      ),
    );
  }
}
