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
    return MaterialApp();
  }
}
