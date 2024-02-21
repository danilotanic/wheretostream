import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { getMovie } from "~/utils/api/movie.server";
import { MovieResponse } from "~/utils/api/moviedb.types";
import {
  RapidAPIResponse,
  RapidListResponse,
} from "~/utils/api/rapidapi.types";

type RawResults = {
  id: number;
  countries?: number;
};

type MovieResponseWithCountries = MovieResponse & { countries: number };

async function getMovieDetails(
  movies: RawResults[],
  context: LoaderFunctionArgs["context"]
) {
  const moviesResponse: MovieResponseWithCountries[] = [];

  for (const movie of movies!) {
    let movieResponse: MovieResponseWithCountries = {
      countries: 0,
    };

    const result = await getMovie({ id: movie.id, context });

    if (result) {
      movieResponse = {
        ...result,
        countries: movie.countries!,
      };
    }

    moviesResponse.push(movieResponse);
  }

  return moviesResponse;
}

async function getStreamingInfo(
  movies: RawResults[],
  context: LoaderFunctionArgs["context"]
) {
  const moviesResponse: RawResults[] = [];

  for (const movie of movies!) {
    let movieResponse = {
      id: 0,
      countries: 0,
    };

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
      movieResponse = {
        id: raw.result.tmdbId,
        countries: Object.keys(raw.result.streamingInfo).length,
      };
    } else {
      movieResponse = {
        id: raw.result.tmdbId,
        countries: 0,
      };
    }

    moviesResponse.push(movieResponse);
  }

  return moviesResponse;
}

async function getMovies({
  context,
}: {
  context: LoaderFunctionArgs["context"];
}) {
  const options = {
    desc: "true",
    country: "us",
    year_min: "2023",
    year_max: "2024",
    show_type: "movie",
    order_by: "popularity_1year",
    services: "apple,disney,hbo,netflix,prime",
  };

  const params = new URLSearchParams(options).toString();
  const response = await fetch(
    `https://streaming-availability.p.rapidapi.com/search/filters?${params}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-RapidAPI-Key": context.env.RAPID_API_KEY,
        "X-RapidAPI-Host": context.env.RAPID_API_HOST,
      },
    }
  );
  const data: RapidListResponse = await response.json();
  return data.result.slice(0, 20);
}

export async function loader({ context }: LoaderFunctionArgs) {
  // Get popular movies
  const data = await getMovies({ context });

  // Get the most minimal data to work with
  const movies: RawResults[] = [];
  data?.map((result) =>
    movies.push({
      id: result.tmdbId,
    })
  );

  // Process the movies
  const moviesWithStreamingInfo = await getStreamingInfo(movies, context);
  const list = await getMovieDetails(moviesWithStreamingInfo, context);

  // Return the processed movies
  return json(list);
}
