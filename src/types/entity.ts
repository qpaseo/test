//파이어베이스 컬랙션 인터페이스 정의

//유저정보
export interface User {
  user_id: string;
  user_age: string;
  user_gender: string;
  user_preferred_food: string;
  food_types: string;
  food_categories: string;
  //유저가 가장 마지막으로 선택한 식단의 매뉴들
  user_recent_diet: string;
}

//유저기 생성한 상태
export interface UserState {
  user_state_id: string;
  user_id: string;
  user_state_name: string;
  user_state_description: string;
  user_state_info: string;
  user_state_is_main: boolean;
}

//유저가 생성한 식단
export interface Diet {
  diet_id: string;
  user_id: string;
  diet_content: string;
  diet_name: string; //생성시 자동으로 생성 (날짜 - [유저가 고른 상태] - [유저가 고른 식사{아침, 점심, 저녁, 식단}])
  created_date: string;
}
