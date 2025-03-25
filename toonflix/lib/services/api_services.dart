import 'package:http/http.dart' as http;

class ApiServices {
  final String baseUrl = "https://webtoon-crawler.nomadcoders.workers.dev";
  final String today = "today";

  void getTodaysToons() async {
    final url = Uri.parse('$baseUrl/$today');
    final res = await http.get(url);
    if (res.statusCode == 200) {
      print(res.body);
      return;
    } else {
      throw Error();
    }
  }
}
