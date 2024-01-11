import { LoaderFunctionArgs } from "@remix-run/cloudflare";

type ResponseError = {
  status_code: number;
  status_message: string;
  success: boolean;
};

export type Result = {
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
};

type UpcomingData = {
  dates: { maximum: string; minimum: string };
  page: number;
  results: Array<MovieData>;
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
    const moviesWithData = [];
    const data: UpcomingData = await response.json();

    // Get the full movie data for each movie
    for (const movie of data.results) {
      const m = await getMovie({ id: movie.id, context });
      moviesWithData.push(m);
    }

    // Replace the results with the full movie data
    data.results = moviesWithData;

    return data;
  } else {
    const error: ResponseError = await response.json();
    return Promise.reject(error);
  }
}

type Genre = {
  id: number;
  name: string;
};

type ProductionCompany = {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
};

type ProductionCountry = {
  iso_3166_1: string;
  name: string;
};

type SpokenLanguage = {
  english_name: string;
  iso_639_1: string;
  name: string;
};

enum Status {
  Released = "Released",
}

export type MovieData = {
  adult: boolean;
  backdrop_path: string;
  belongs_to_collection: null;
  budget: number;
  genres: Array<Genre>;
  homepage: string;
  id: number;
  imdb_id: string;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  production_companies: Array<ProductionCompany>;
  production_countries: Array<ProductionCountry>;
  release_date: string;
  revenue: number;
  runtime: number;
  spoken_languages: Array<SpokenLanguage>;
  status: Status;
  tagline: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
};

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
