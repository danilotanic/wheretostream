import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { ResponseError, SearchMultiResponse } from "~/utils/api/moviedb.types";

export async function getMovieOrSeries({
  query,
  context,
}: {
  query: string;
  context: LoaderFunctionArgs["context"];
}): Promise<SearchMultiResponse["results"]> {
  const response = await fetch(
    `https://api.themoviedb.org/3/search/multi?query=${query}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${context.env.TMDB_ACCESS_TOKEN}`,
      },
    }
  );

  if (response.ok) {
    const data: SearchMultiResponse = await response.json();
    return data.results;
  } else {
    const error: ResponseError = await response.json();
    return Promise.reject(error);
  }
}
