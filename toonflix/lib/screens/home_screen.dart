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
            //builder : 최적화를 위해 사용, 화면 밖에 있으면 메모리에서 삭제
            //separated : builder + 요소 사이에 구분자
            return Column(
              children: [
                SizedBox(
                  height: 50,
                ),
                //Expanded : 남는 공간 차지하는 위젯
                Expanded(
                  child: makeList(snapshot),
                ),
              ],
            );
          }
          return Center(
            child: CircularProgressIndicator(),
          );
        },
      ),
    );
  }

  ListView makeList(AsyncSnapshot<List<WebtoonModel>> snapshot) {
    return ListView.separated(
      scrollDirection: Axis.horizontal,
      itemCount: snapshot.data!.length,
      padding: EdgeInsets.symmetric(vertical: 10, horizontal: 20),
      itemBuilder: (context, index) {
        var webtoon = snapshot.data![index];
        print(webtoon.thumb);
        return Column(
          children: [
            Container(
              width: 250,
              clipBehavior: Clip.hardEdge,
              decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(15),
                  boxShadow: [
                    BoxShadow(
                      blurRadius: 15,
                      offset: Offset(10, 10),
                      color: Colors.black.withOpacity(0.3),
                    )
                  ]),
              child: Image.network(
                webtoon.thumb,
                headers: const {
                  'Referer': 'https://comic.naver.com',
                },
              ),
            ),
            SizedBox(
              height: 10,
            ),
            Text(
              webtoon.title,
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        );
      },
      separatorBuilder: (context, index) => SizedBox(
        width: 40,
      ),
    );
  }
}
