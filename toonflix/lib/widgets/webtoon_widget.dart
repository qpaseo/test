import 'package:flutter/material.dart';
import 'package:toonflix/screens/detail_screen.dart';

class Webtoon extends StatelessWidget {
  final String title, thumb, id;
  const Webtoon({
    super.key,
    required this.title,
    required this.id,
    required this.thumb,
  });

  @override
  Widget build(BuildContext context) {
    //GestureDetector : 동작 감지(이벤트 리스너)
    return GestureDetector(
      onTap: () {
        // Navigator.push : 페이지 변경시 에니메이션 추가
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                DetailScreen(title: title, id: id, thumb: thumb),
            //fullscreenDialog 에니메이션 - 바닥에서 올라오기
            fullscreenDialog: true,
          ),
        );
      },
      child: Column(
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
              thumb,
              headers: const {
                'Referer': 'https://comic.naver.com',
              },
            ),
          ),
          SizedBox(
            height: 10,
          ),
          Text(
            title,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }
}
