import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { ListType, getList } from "~/utils/api/list.server";
import { DiscoverMovieResponse } from "~/utils/api/moviedb.types";
import { RapidAPIResponse } from "~/utils/api/rapidapi.types";

async function processMovies(
  movies: DiscoverMovieResponse["results"],
  context: LoaderFunctionArgs["context"]
) {
  for (const movie of movies!) {
    const response = await fetch(
      `https://streaming-availability.p.rapidapi.com/get?tmdb_id=movie/${movie.id}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          "X-RapidAPI-Key": context.env.RAPID_API_KEY,
          "X-RapidAPI-Host": context.env.RAPID_API_HOST,
        },
      }
    );
    const raw: RapidAPIResponse = await response.json();

    // Check if raw.result and raw.result.streamingInfo are defined and raw.result.streamingInfo is an object
    if (
      raw.result &&
      raw.result.streamingInfo &&
      typeof raw.result.streamingInfo === "object"
    ) {
      movie.countries = Object.keys(raw.result.streamingInfo).length;
    } else {
      movie.countries = 0; // or any default value you deem appropriate
    }
  }
}

type DiscoverMovieResponseWithLastUpdate = DiscoverMovieResponse & {
  lastUpdate: number;
};

export async function loader({ context }: LoaderFunctionArgs) {
  // Get the last data from the KV store
  const nowPlaying = (await context.env.KV.get("nowPlaying", {
    type: "json",
  })) as DiscoverMovieResponseWithLastUpdate;
  const popular = (await context.env.KV.get("popular", {
    type: "json",
  })) as DiscoverMovieResponseWithLastUpdate;
  const upcoming = (await context.env.KV.get("upcoming", {
    type: "json",
  })) as DiscoverMovieResponseWithLastUpdate;

  // Get all the dates
  const dates = [
    { id: "nowPlaying", date: nowPlaying.lastUpdate },
    { id: "popular", date: popular.lastUpdate },
    { id: "upcoming", date: upcoming.lastUpdate },
  ];

  // Get the least recent date
  const leastRecentDateId = dates.reduce((prev, current) => {
    return prev.date < current.date ? prev : current;
  });

  // Get the list with the least recent date
  const list = await getList({ id: leastRecentDateId.id as ListType, context });

  // Process the movies
  if (list.results) {
    await processMovies(list.results, context);

    // Update the KV store with the new data
    context.env.KV.put(
      leastRecentDateId.id,
      JSON.stringify({ ...list, lastUpdate: new Date().getTime() })
    );
  }

  return json({ status: "ok", updated: leastRecentDateId.id });
}
