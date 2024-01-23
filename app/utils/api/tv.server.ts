import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  MovieResult,
  ResponseError,
  ShowResponse,
} from "~/utils/api/moviedb.types";

export async function getShow({
  id,
  context,
}: {
  id: MovieResult["id"];
  context: LoaderFunctionArgs["context"];
}): Promise<ShowResponse> {
  const response = await fetch(`https://api.themoviedb.org/3/tv/${id}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${context.env.TMDB_ACCESS_TOKEN}`,
    },
  });

  if (response.ok) {
    const data: ShowResponse = await response.json();
    return data;
  } else {
    const error: ResponseError = await response.json();
    return Promise.reject(error);
  }
}
