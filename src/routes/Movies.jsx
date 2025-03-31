import { gql, useQuery } from "@apollo/client";
import { Link } from "react-router-dom";

const GET_MOVIES = gql`
  query getAllMovies {
    allMovies {
      title
      id
    }
  }
`;

const Movies = () => {
  const { data, loading, error } = useQuery(GET_MOVIES);
  if (loading) {
    return <ul>Loading...</ul>;
  }
  if (error) {
    return <h1>{"연결 실패"}</h1>;
  }

  return (
    <ul>
      <h1>Movies</h1>
      {data.allMovies.map((movie) => (
        <li key={movie.id}>
          <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
        </li>
      ))}
    </ul>
  );
};

export default Movies;
