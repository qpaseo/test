import 'package:flutter/material.dart';
import 'package:toonflix/models/webtoon.model.dart';
import 'package:toonflix/services/api_services.dart';

class HomeScreen extends StatelessWidget {
  HomeScreen({super.key});

  Future<List<WebtoonModel>> webtoons = ApiServices.getTodaysToons();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,
      appBar: AppBar(
        //매우 중요!!!!
        elevation: 2,
        surfaceTintColor: Colors.white,
        shadowColor: Colors.black,
        //
        backgroundColor: Colors.white,
        foregroundColor: Colors.green,
        title: const Text(
          "Today's 툰s",
          style: TextStyle(
            fontWeight: FontWeight.w600,
            fontSize: 24,
          ),
        ),
      ),

      //FutureBuilder : 안에서 http 연결 가능하게 하는 위젯
      body: FutureBuilder(
        //가져오는 api함수
        future: webtoons,

        //api 상테, 데이터 추출 
        //context 위젯 트리
        //snapshot 비동기 작업 결과
        builder: (context, snapshot) {
          if (snapshot.hasData) {
            return const Text("There is data!");
          }
          return const Text("Loading...");
        },
      ),
    );
  }
}
