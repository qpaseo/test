import potato from "../styles/movie-info.module.css";
import { API_URL } from "../app/constants";
import Link from "next/link";

export async function getMovie(id: string) {
  const response = await fetch(`${API_URL}/${id}`);
  return response.json();
}

export async function getProviders(id: string) {
  const response = await fetch(`${API_URL}/${id}/providers`);
  return response.json();
}

export default async function MovieProvidersInfo({ id }: { id: string }) {
  const movie = await getMovie(id);
  const providers = await getProviders(id);

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
        <a href={providers.AU?.link} target="_blank">
          Providers (AU) &rarr;
        </a>

        <div className={potato.tabs}>
          <Link href={`/movies/${id}`}>Movie Info</Link>{" "}
          <Link href={`/movies/${id}/similar`}>Similar Movies</Link>{" "}
          <Link href={`/movies/${id}/providers`} className={potato.selected}>
            Movie Providers
          </Link>{" "}
        </div>
      </div>
    </div>
  );
}
