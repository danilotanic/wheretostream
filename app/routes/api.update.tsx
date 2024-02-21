import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { getMovie } from "~/utils/api/movie.server";
import {
  DiscoverMovieResponse,
  MovieResponse,
} from "~/utils/api/moviedb.types";
import {
  RapidAPIResponse,
  RapidChangesResponse,
  RapidListResponse,
} from "~/utils/api/rapidapi.types";

type DiscoverMovieResponseWithLastUpdate = DiscoverMovieResponse & {
  lastUpdate: number;
};

type RawResults = {
  id: number;
  countries?: number;
};

type MovieResponseWithCountries = MovieResponse & { countries: number };

type Types = "popular" | "upcoming" | "now_playing";

type GetProps = {
  type: Types;
  context: LoaderFunctionArgs["context"];
};

const options = {
  // NEW
  now_playing: {
    country: "us",
    services: "apple,disney,hbo,netflix,prime",
    change_type: "new",
    target_type: "movie",
    order_by: "year",
    desc: "true",
  },
  upcoming: {
    desc: "false",
    country: "us",
    year_min: "2023",
    year_max: "2024",
    show_type: "movie",
    order_by: "year",
    services: "apple,disney,hbo,netflix,prime",
  },
  popular: {
    desc: "true",
    country: "us",
    year_min: "2023",
    year_max: "2024",
    show_type: "movie",
    order_by: "popularity_1year",
    services: "apple,disney,hbo,netflix,prime",
  },
};

async function wait() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

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

async function getMovies({ type, context }: GetProps) {
  const params = new URLSearchParams(options[type]).toString();
  const path = type === "now_playing" ? "changes" : "search/filters";

  const response = await fetch(
    `https://streaming-availability.p.rapidapi.com/${path}?${params}`,
    {
      method: "GET",
      headers: {
        accept: "application/json",
        "X-RapidAPI-Key": context.env.RAPID_API_KEY,
        "X-RapidAPI-Host": context.env.RAPID_API_HOST,
      },
    }
  );

  if (path === "changes") {
    const data: RapidChangesResponse = await response.json();
    console.log(data);
    return data.result?.map((item) => item.show).slice(0, 20);
  } else {
    const data: RapidListResponse = await response.json();
    return data.result.slice(0, 20);
  }
}

async function getAndProcessMovies({ type, context }: GetProps) {
  // Get popular movies
  const data = await getMovies({ type: type, context });

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

  return list;
}

const fakeData = {
  page: 1,
  results: [],
  total_pages: 1,
  total_results: 1,
};

export async function loader({ context }: LoaderFunctionArgs) {
  const storage = await context.env.KV.list();

  // Initialization logic, ensure it's done only once
  const categories = ["now_playing", "popular", "upcoming"];
  for (const category of categories) {
    if (!storage.keys.find((key) => key.name === category)) {
      await context.env.KV.put(
        category,
        JSON.stringify({
          lastUpdate: new Date().getTime(),
          ...fakeData,
        })
      );
      await wait(); // Ensuring sequential initialization
    }
  }

  // Retrieve and compare last update times
  const promises = categories.map((category) =>
    context.env.KV.get(category, { type: "json" })
  );
  const [nowPlaying, popular, upcoming] = await Promise.all(promises);

  const dates: { id: Types; date: number }[] = [
    {
      id: "now_playing",
      date: Number(
        (nowPlaying as DiscoverMovieResponseWithLastUpdate)?.lastUpdate
      ),
    },
    {
      id: "popular",
      date: Number(
        (popular as DiscoverMovieResponseWithLastUpdate)?.lastUpdate
      ),
    },
    {
      id: "upcoming",
      date: Number(
        (upcoming as DiscoverMovieResponseWithLastUpdate)?.lastUpdate
      ),
    },
  ];

  const leastRecentDateId = dates.reduce((prev, current) =>
    prev.date < current.date ? prev : current
  ).id;

  const list = await getAndProcessMovies({ type: leastRecentDateId, context });

  if (list && list.length > 0) {
    // Update the KV store with the new data
    const data = JSON.stringify({
      results: list,
      lastUpdate: new Date().getTime(),
    });
    await context.env.KV.put(leastRecentDateId, data);
  }

  return json({ status: "ok", updated: leastRecentDateId });
}
