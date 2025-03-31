import { gql, useQuery } from "@apollo/client";
import { useParams } from "react-router-dom";

const GET_MOVIE = gql`
  query getMovie($movieId: String!) {
    movie(id: $movieId) {
      id
      title
      small_cover_image
    }
  }
`;

const Movie = () => {
  const { id } = useParams();
  const { data, loading } = useQuery(GET_MOVIE, {
    variables: {
      movieId: id,
    },
  });
  if (loading) {
    return <h1>loading movie</h1>;
  }
  return <div>{data.movie.title}</div>;
};
export default Movie;
