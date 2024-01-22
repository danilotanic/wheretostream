import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  DiscoverMovieResponse,
  ResponseError,
} from "~/utils/api/moviedb.types";

export enum ListType {
  Popular = "popular",
  Upcoming = "upcoming",
  TopRated = "top_rated",
  NowPlaying = "now_playing",
}

export async function getList({
  id = ListType.Popular,
  context,
}: {
  id: ListType;
  context: LoaderFunctionArgs["context"];
}): Promise<DiscoverMovieResponse> {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${context.env.TMDB_ACCESS_TOKEN}`,
    },
  });

  if (response.ok) {
    const data: DiscoverMovieResponse = await response.json();
    return data;
  } else {
    const error: ResponseError = await response.json();
    return Promise.reject(error);
  }
}
