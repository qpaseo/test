import { Suspense } from "react";
import MovieSimilarInfo, {
  getMovie,
} from "../../../../../components/movie-similar-info";
import MovieSimilar from "../../../../../components/movie-similar";

type IParams = Promise<{ id: string }>;

//export 해야 함수를 찾아 실행 -> metadata 적용
export async function generateMetadata({ params }: { params: IParams }) {
  const { id } = await params;
  const movie = await getMovie(id);
  return {
    title: movie.title,
  };
}

export default async function SimilarPage({ params }: { params: IParams }) {
  const { id } = await params;
  return (
    <div>
      <Suspense fallback={<h1>loading movie info</h1>}>
        <MovieSimilarInfo id={id} />
      </Suspense>

      <Suspense fallback={<h1>loading movie info</h1>}>
        <MovieSimilar id={id} />
      </Suspense>
    </div>
  );
}
