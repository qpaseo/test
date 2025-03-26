import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:toonflix/models/webtoon_episode_model.dart';
import 'package:toonflix/models/webtoon_model.dart';
import 'package:toonflix/models/webtoon_detail_model.dart';

class ApiServices {
  static final String baseUrl =
      "https://webtoon-crawler.nomadcoders.workers.dev";
  static final String today = "today";

  /// 오늘의 웹툰 가져오기
  static Future<List<WebtoonModel>> getTodaysToons() async {
    List<WebtoonModel> webtoonInstances = [];
    final url = Uri.parse('$baseUrl/$today');
    final res = await http.get(url);

    if (res.statusCode == 200) {
      final List<dynamic> webToonList = jsonDecode(res.body);
      for (var webtoon in webToonList) {
        webtoonInstances.add(WebtoonModel.fromJson(webtoon));
      }
      return webtoonInstances;
    } else {
      throw Exception("Failed to load today's webtoons");
    }
  }

  /// 웹툰 상세 정보 가져오기
  static Future<WebtoonDetailModel> getToonById(String id) async {
    final url = Uri.parse("$baseUrl/$id/");
    final res = await http.get(url);

    if (res.statusCode == 200) {
      final webtoon = jsonDecode(res.body);
      return WebtoonDetailModel.fromJson(webtoon);
    } else {
      throw Exception("Failed to load webtoon details");
    }
  }

  /// 최신 에피소드 가져오기
  static Future<List<WebtoonEpisodeModel>> getLatestEpisodesById(
      String id) async {
    List<WebtoonEpisodeModel> episodesInstances = [];
    final url = Uri.parse("$baseUrl/$id/episodes");
    final res = await http.get(url);

    if (res.statusCode == 200) {
      final List<dynamic> episodes = jsonDecode(res.body);
      for (var episode in episodes) {
        episodesInstances.add(WebtoonEpisodeModel.fromJson(episode));
      }
      return episodesInstances;
    } else {
      print(res.statusCode);
      print(res.body);
      throw Exception("Failed to load episodes");
    }
  }
}
