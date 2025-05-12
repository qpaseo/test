import potato from "../styles/movie-info.module.css";
import { API_URL } from "../app/constants";
import Link from "next/link";

export async function getMovie(id: string) {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
}

export default async function MovieDetailInfo({ id }: { id: string }) {
  const movie = await getMovie(id);

  return (
    <div className={potato.container}>
      <img
        src={movie.poster_path}
        className={potato.poster}
        alt={movie.title}
      />
      <div className={potato.info}>
        <h1 className={potato.title}>{movie.title}</h1>
        <h3>⭐️ {movie.vote_average.toFixed(1)}</h3>
        <p>{movie.overview}</p>
        <a href={movie.homepage} target={"_blank"}>
          Homepage &rarr;
        </a>

        <div className={potato.tabs}>
          <Link href={`/movies/${id}`} className={potato.selected}>
            Movie Info
          </Link>{" "}
          <Link href={`/movies/${id}/similar`}>Similar Movies</Link>{" "}
          <Link href={`/movies/${id}/providers`}>Movie Providers</Link>{" "}
        </div>
      </div>
    </div>
  );
}
