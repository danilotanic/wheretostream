import { LoaderFunctionArgs } from "@remix-run/cloudflare";
import { MovieData, ProviderListData, ResponseError } from "~/utils/tmdb/types";

export async function getMovie({
  id,
  context,
}: {
  id: MovieData["id"];
  context: LoaderFunctionArgs["context"];
}): Promise<MovieData> {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${id}`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${context.env.TMDB_ACCESS_TOKEN}`,
    },
  });

  if (response.ok) {
    const data: MovieData = await response.json();
    return data;
  } else {
    const error: ResponseError = await response.json();
    return Promise.reject(error);
  }
}

export async function getProviders({
  id,
  context,
}: {
  id: MovieData["id"];
  context: LoaderFunctionArgs["context"];
}): Promise<ProviderListData> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/watch/providers`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${context.env.TMDB_ACCESS_TOKEN}`,
      },
    }
  );

  if (response.ok) {
    const data: ProviderListData = await response.json();
    return data;
  } else {
    const error: ResponseError = await response.json();
    return Promise.reject(error);
  }
}