import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Card from "~/components/card";
import { ListType, getList } from "~/utils/api/list.server";
import { DiscoverMovieResponse } from "~/utils/api/moviedb.types";

export const meta: MetaFunction = () => {
  return [{ title: "Where to stream?" }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const filter = (url.searchParams.get("filter") as ListType) ?? undefined;

  let nowPlaying, popular, upcoming;

  if (process.env.NODE_ENV !== "development") {
    nowPlaying = await context.env.KV.get("nowPlaying", { type: "json" });
    popular = await context.env.KV.get("popular", { type: "json" });
    upcoming = await context.env.KV.get("upcoming", { type: "json" });
  } else {
    nowPlaying = await getList({ id: ListType.NowPlaying, context });
    popular = await getList({ id: ListType.Popular, context });
    upcoming = await getList({ id: ListType.Upcoming, context });
  }

  return json({ filter, nowPlaying, popular, upcoming });
}

export default function Home() {
  const { filter, nowPlaying, popular, upcoming } =
    useLoaderData<typeof loader>();

  const data: Record<string, DiscoverMovieResponse> = {
    nowPlaying: nowPlaying as DiscoverMovieResponse,
    popular: popular as DiscoverMovieResponse,
    upcoming: upcoming as DiscoverMovieResponse,
  };
  const currentList: DiscoverMovieResponse = data[filter ?? "nowPlaying"];

  return (
    <section className="grid-container px-6">
      {currentList.results && currentList.results.length > 0 ? (
        <>
          {currentList.results.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </>
      ) : null}
    </section>
  );
}
