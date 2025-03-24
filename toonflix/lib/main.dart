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

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
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
        backgroundColor: Colors.black,
        body: SingleChildScrollView(
          child: Padding(
            padding: EdgeInsets.symmetric(
              horizontal: 20,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                SizedBox(
                  height: 80,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.end,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Text(
                          'Hey, Selena',
                          style: TextStyle(
                              color: Colors.white,
                              fontSize: 28,
                              fontWeight: FontWeight.w800),
                        ),
                        Text(
                          'Welcome back',
                          style: TextStyle(
                            color: Color.fromRGBO(255, 255, 255, 0.5),
                            fontSize: 18,
                          ),
                        ),
                      ],
                    )
                  ],
                ),
                SizedBox(
                  height: 0,
                ),
                Text(
                  'Total Balanse',
                  style: TextStyle(
                    fontSize: 22,
                    color: Color.fromRGBO(255, 255, 255, 0.5),
                  ),
                ),
                SizedBox(
                  height: 5,
                ),
                Text(
                  '\$5 194 482',
                  style: TextStyle(
                    fontSize: 48,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
                SizedBox(
                  height: 30,
                ),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceAround,
                  children: [
                    Button(
                      text: "Teansfer",
                      bgColor: Color(0xFFF1B33B),
                      textColor: Colors.black,
                    ),
                    Button(
                      text: "Requset",
                      bgColor: Color(0xFF1F2123),
                      textColor: Colors.white,
                    ),
                  ],
                ),
                SizedBox(
                  height: 40,
                ),
                Row(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Wallets',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 36,
                          fontWeight: FontWeight.w600),
                    ),
                    Text(
                      "View All",
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: 18,
                      ),
                    ),
                  ],
                ),
                SizedBox(
                  height: 10,
                ),
                CurrencyCard(
                  name: "Euro",
                  code: "EUR",
                  amount: "6 428",
                  icon: Icons.euro_rounded,
                  isInverted: false,
                  order: 1,
                ),
                CurrencyCard(
                  name: "Bitcoin",
                  code: "BTC",
                  amount: "9 785",
                  icon: Icons.currency_bitcoin,
                  isInverted: true,
                  order: 2,
                ),
                CurrencyCard(
                  name: "Dollar",
                  code: "USD",
                  amount: "428",
                  icon: Icons.attach_money_outlined,
                  isInverted: false,
                  order: 3,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
