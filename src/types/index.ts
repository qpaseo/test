export interface User {
  user_id: string;
  email: string;
  name: string;
  food_types: string;
  food_categories: string;
}

export interface UserState {
  user_state_id: string;
  user_id: string;
  user_state_name: string;
  user_state_description: string;
  user_state_info: string;
  user_state_is_main: boolean;
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
}

export interface diet {
  diet_id: string;
  user_id: string;
  diet_content: string;
  diet_name: string;
  diet_create_date: string;
}
