import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:toonflix/models/webtoon_episode_model.dart';
import 'package:toonflix/models/webtoon_model.dart';
import 'package:toonflix/models/webtoon_detail_model.dart';

class ApiServices {
  static final String baseUrl =
      "https://webtoon-crawler.nomadcoders.workers.dev";
  static final String today = "today";

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
      throw Error();
    }
  }

  static Future<WebtoonDetailModel> getLatestEpisodesById(String id) async {
    List<WebtoonDetailModel> episodsInstances = [];

    final url = Uri.parse("$baseUrl/$id/episodes");
    final res = await http.get(url);
    if (res.hashCode == 200) {
      final episodes = jsonDecode(res.body);
      for (var episode in episodes) {
        episodsInstances.add(WebtoonDetailModel.formJson(episode));
      }
    }
    throw Error();
  }
}
