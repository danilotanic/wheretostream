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

export async function loader({ context }: LoaderFunctionArgs) {
  const nowPlaying = await getList({ id: ListType.NowPlaying, context });
  const popular = await getList({ id: ListType.Popular, context });
  const upcoming = await getList({ id: ListType.Upcoming, context });

  if (nowPlaying.results) {
    await processMovies(nowPlaying.results, context);
    context.env.KV.put("nowPlaying", JSON.stringify(nowPlaying));
  }

  if (popular.results) {
    await processMovies(popular.results, context);
    context.env.KV.put("popular", JSON.stringify(popular));
  }

  if (upcoming.results) {
    await processMovies(upcoming.results, context);
    context.env.KV.put("upcoming", JSON.stringify(upcoming));
  }

  return json({ status: "ok" });
}
