import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { ResponseError, SearchListType } from "~/utils/tmdb/types";

export async function searchMovieOrSeries({
  query,
  context,
}: {
  query: string;
  context: LoaderFunctionArgs["context"];
}): Promise<SearchListType["results"] | ResponseError> {
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
    const data: SearchListType = await response.json();
    return data.results;
  } else {
    const error: ResponseError = await response.json();
    return Promise.reject(error);
  }
}
