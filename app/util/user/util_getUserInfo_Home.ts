import { GetUserInfoReturnDto_Home } from '../../types/util_types/dto/userDto';
import { db } from '../../firebase/firebase';
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import { ErrorReturnDto } from '../../types/util_types/dto/authDto';

export async function util_getUserInfoDto(): Promise<
  GetUserInfoReturnDto_Home | ErrorReturnDto
> {
  // user 데이터 가져오기
  const userDocRef = doc(db, 'user', 'USER_ID');
  const userSnap = await getDoc(userDocRef);
  const userData = userSnap.data();

  // quiz 데이터 가져오기
  const quizColRef = collection(db, 'quiz');
  const quizSnap = await getDocs(quizColRef);
  const quizList = quizSnap.docs.map((doc) => doc.data());

  // 랜덤 인덱스 선택 (0~9)
  const randomIdx = Math.floor(Math.random() * Math.min(quizList.length, 10));
  const quiz = quizList[randomIdx];

  // 구글 뉴스 RSS 가져오기
  const rssUrl =
    'https://news.google.com/rss/search?q=개인정보%20유출&hl=ko&gl=KR&ceid=KR:ko';
  const rssRes = await axios.get(rssUrl);
  const parser = new XMLParser();
  const rssJson = parser.parse(rssRes.data);
  const newsList = rssJson.rss.channel.item.map((item: any) => ({
    title: item.title,
    link: item.link,
    pubDate: item.pubDate,
  }));
  if (!userData) {
    return {
      message: '사용자 정보를 찾을 수 없습니다.',
      type: 'error',
    };
  }

  return {
    type: 'success',
    name: userData.user_name,
    email: userData.user_email,
    user_search_count: userData.user_search_count,
    quiz: {
      quiz_title: quiz.quiz_title,
      quiz_answers: quiz.quiz_answers,
      quiz_right_answer_number: quiz.quiz_right_answer_number,
    },
    news: newsList,
  };
}
