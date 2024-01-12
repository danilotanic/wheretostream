import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { ListData, ResponseError } from "~/utils/tmdb/types";

type ResponseData = {
  dates: { maximum: string; minimum: string };
  page: number;
  results: Array<ListData>;
};

export enum ListType {
  NowPlaying = "now_playing",
  Popular = "popular",
  TopRated = "top_rated",
  Upcoming = "upcoming",
}

export async function getList({
  id = ListType.Popular,
  context,
}: {
  id: ListType;
  context: LoaderFunctionArgs["context"];
}): Promise<ResponseData> {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${context.env.TMDB_ACCESS_TOKEN}`,
    },
  });

  if (response.ok) {
    const data: ResponseData = await response.json();
    return data;
  } else {
    const error: ResponseError = await response.json();
    return Promise.reject(error);
  }
}
