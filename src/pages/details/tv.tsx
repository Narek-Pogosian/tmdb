import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { removeDuplicates } from "@/lib/utils";
import { useScrollTop } from "@/hooks/use-scroll-top";
import { api } from "@/lib/api";
import RowList from "@/components/row-list";
import PersonCard from "@/components/cards/person-card";
import ErrorPage from "./components/error-page";

import DetailsInfo, {
  DetailsInfoSkeletonShell,
} from "./components/details-info";

function TvShowDetails() {
  useScrollTop();
  const { id } = useParams();

  const {
    data: tvShow,
    error,
    isLoading,
    isSuccess,
  } = useQuery({
    queryKey: ["tv", id],
    queryFn: () => api.getTvDetails(id),
    select: (data) => ({
      ...data,
      videos: data.videos.results.filter((video) => video.type === "Trailer"),
      credits: {
        ...data.credits,
        cast: removeDuplicates(data.credits.cast),
      },
    }),
  });

  if (error) {
    return <ErrorPage />;
  }

  if (isLoading) {
    return (
      <>
        <DetailsInfoSkeletonShell />
        <section>
          <h2>Cast</h2>
          <RowList isLoading items={[]} isPerson render={() => <></>} />
        </section>
      </>
    );
  }

  if (isSuccess) {
    return (
      <>
        <DetailsInfo
          crew={tvShow.credits.crew}
          genres={tvShow.genres}
          poster={tvShow.poster_path}
          backdrop={tvShow.backdrop_path}
          overview={tvShow.overview}
          release={tvShow.first_air_date}
          title={tvShow.name}
          trailer={tvShow.videos[0]}
          vote={tvShow.vote_average}
          voteCount={tvShow.vote_count}
        />
        <section aria-describedby="cast">
          <h2 id="cast">Cast</h2>
          <RowList
            items={tvShow?.credits.cast.sort(
              (a, b) => b.popularity - a.popularity
            )}
            isLoading={isLoading}
            isError={!!error}
            isPerson
            render={(person) => (
              <PersonCard
                id={person.id}
                image={person.profile_path}
                name={person.name}
                character={person.character}
              />
            )}
          />
        </section>
      </>
    );
  }
}

export default TvShowDetails;
