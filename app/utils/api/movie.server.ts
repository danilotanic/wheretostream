import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import {
  MovieResponse,
  MovieResult,
  ResponseError,
} from "~/utils/api/moviedb.types";

export async function getMovie({
  id,
  context,
}: {
  id: MovieResult["id"];
  context: LoaderFunctionArgs["context"];
}): Promise<MovieResponse> {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${context.env.TMDB_ACCESS_TOKEN}`,
    },
  });

  if (response.ok) {
    const data: MovieResponse = await response.json();
    return data;
  } else {
    const error: ResponseError = await response.json();
    return Promise.reject(error);
  }
}
