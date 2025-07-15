export class ErrorReturnDto {
  type!: 'error';
  message!: string;
}

export class GetUserInfoDto {
  email!: string;
}

export class GetUserInfoReturnDto_Profile {
  type!: 'success' | 'error';
  name!: string;
  email!: string;
  user_search_total_count!: number;
  user_search_count!: number;
  user_img_avg_score!: number;

  user_dark_mode!: boolean;
  user_instagram_auto_sharing!: boolean;
}

export class GetUserInfoReturnDto_Home {
  type!: 'success' | 'error';
  name!: string;
  email!: string;

  user_search_count!: number;

  quiz?: {
    quiz_title: string;
    quiz_answers: {
      answer: string;
    }[];
    quiz_right_answer_number: number;
  };

  news!: {
    title: string;
    description: string;
    date: string;
    link: string;
  };
}
