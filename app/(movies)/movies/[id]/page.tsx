import { Suspense } from "react";
import MovieDetailInfo, {
  getMovie,
} from "../../../../components/movie-detail-info";
import MovieVideos from "../../../../components/movie-videos";

//받아 내려오는 타입은 Promise를 사용해야함
type IParams = Promise<{ id: string }>;

export async function generateMetadata(props: { params: IParams }) {
  const params = await props.params;
  const id = params.id;
  const movie = await getMovie(id);
  return {
    title: movie.title,
  };
}

export default async function MovieDetailPage(props: { params: IParams }) {
  const params = await props.params;
  const id = params.id;
  return (
    <div>
      <Suspense fallback={<h1>loading movie info</h1>}>
        <MovieDetailInfo id={id} />
      </Suspense>

      <Suspense fallback={<h1>loading movie videos</h1>}>
        <MovieVideos id={id} />
      </Suspense>
    </div>
  );
}
