import { EmptyMessage, EndMessage, ErrorMessage } from "./components/messages";
import { useShowDescriptiveGrid } from "@/hooks/use-show-descriptive-grid";
import { useGetInfiniteQuery } from "@/hooks/use-get-infinite";
import { List, SkeletonList } from "./components/lists";
import { api } from "@/lib/api";

import DiscoverLayout from "./components/discover-layout";
import InfiniteScroll from "react-infinite-scroll-component";
import DescriptiveCard from "@/components/cards/descriptive-card";
import MovieCard from "@/components/cards/movie-card";
import Loader from "./components/loader";

export default function Movies() {
  return (
    <DiscoverLayout>
      <MoviesContent />
    </DiscoverLayout>
  );
}

function MoviesContent() {
  const { showDescriptiveGrid } = useShowDescriptiveGrid();
  const { result, isLoading, isError, fetchNextPage, hasNextPage } =
    useGetInfiniteQuery({
      queryKey: "movies",
      queryFn: api.getMovies,
    });

  if (isLoading) {
    return <SkeletonList />;
  }

  if (result.length === 0) {
    return <EmptyMessage mediaType="movie" />;
  }

  return (
    <InfiniteScroll
      next={fetchNextPage}
      dataLength={result.length}
      hasMore={hasNextPage}
      loader={!isError && <Loader />}
      endMessage={result.length > 20 && <EndMessage />}
    >
      <List
        items={result}
        render={(movie) =>
          showDescriptiveGrid ? (
            <DescriptiveCard
              image={movie.poster_path}
              overview={movie.overview}
              title={movie.title}
              vote={movie.vote_average}
              voteCount={movie.vote_count}
              href={`/movie/${movie.id}`}
              backdrop={movie.backdrop_path}
            />
          ) : (
            <MovieCard movie={movie} />
          )
        }
      />
      <ErrorMessage isError={isError} />
    </InfiniteScroll>
  );
}
