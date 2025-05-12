import { Suspense } from "react";
import MovieProvidersInfo, {
  getMovie,
} from "../../../../../components/movie-providers-info";

type IParams = Promise<{ id: string }>;

//export 해야 함수를 찾아 실행 -> metadata 적용
export async function generateMetadata({ params }: { params: IParams }) {
  const { id } = await params;
  const movie = await getMovie(id);
  return {
    title: movie.title,
  };
}

export default async function ProvidersPage({ params }: { params: IParams }) {
  const { id } = await params;
  return (
    <div>
      <Suspense fallback={<h1>loading movie info</h1>}>
        <MovieProvidersInfo id={id} />
      </Suspense>

      <Suspense fallback={<h1>loading providers</h1>}></Suspense>
    </div>
  );
}
