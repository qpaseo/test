import { API_URL } from "../app/constants";
import styles from "../styles/movie-similar.module.css";

export async function getMovie(id: string) {
  const response = await fetch(`${API_URL}/${id}/similar`);
  return response.json();
}

export default async function MovieSimilar({ id }: { id: string }) {
  const movies = await getMovie(id);
  return (
    <div className={styles.container}>
      {movies.map((movie) => (
        <div className={styles.item}>
          <iframe
            key={movie.id}
            src={`${movie.backdrop_path}`}
            allowFullScreen
          />
          <h1>{movie.title}</h1>
        </div>
      ))}
    </div>
  );
}
