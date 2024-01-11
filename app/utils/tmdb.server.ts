import { LoaderFunctionArgs } from "@remix-run/cloudflare";

type ResponseError = {
  status_code: number;
  status_message: string;
  success: boolean;
};

type UpcomingData = {
  dates: { maximum: string; minimum: string };
  page: number;
  results: Array<{
    adult: boolean;
    backdrop_path: string;
    genre_ids: [];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }>;
};

export async function getUpcoming({
  context,
}: {
  context: LoaderFunctionArgs["context"];
}): Promise<UpcomingData> {
  const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${context.env.TMDB_ACCESS_TOKEN}`,
    },
  });

  if (response.ok) {
    const data: UpcomingData = await response.json();
    return data;
  } else {
    const error: ResponseError = await response.json();
    return Promise.reject(error);
  }
}
