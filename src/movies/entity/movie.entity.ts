//entity : 서버가 db한테 보내는거

export class Movie {
  id: number;
  title: string;
  year: number;
  genres?: string[];
}
