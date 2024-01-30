import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { ListType, getList } from "~/utils/api/list.server";
import { DiscoverMovieResponse } from "~/utils/api/moviedb.types";
import { RapidAPIResponse } from "~/utils/api/rapidapi.types";

async function wait() {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

async function processMovies(
  movies: DiscoverMovieResponse["results"],
  context: LoaderFunctionArgs["context"]
) {
  for (const movie of movies!) {
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

    console.log(raw);

    // Check if raw.result and raw.result.streamingInfo are defined and raw.result.streamingInfo is an object
    if (
      raw.result &&
      raw.result.streamingInfo &&
      typeof raw.result.streamingInfo === "object"
    ) {
      movie.countries = Object.keys(raw.result.streamingInfo).length;
    } else {
      movie.countries = 0; // or any default value you deem appropriate
    }
  }
}

type DiscoverMovieResponseWithLastUpdate = DiscoverMovieResponse & {
  lastUpdate: number;
};

const fakeData = {
  page: 1,
  results: [],
  total_pages: 1,
  total_results: 1,
};

export async function loader({ context }: LoaderFunctionArgs) {
  const storage = await context.env.KV.list();

  // Initialization logic, ensure it's done only once
  const categories = ["nowPlaying", "popular", "upcoming"];
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

  const dates = [
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

  console.log("DATES: ", dates);

  const leastRecentDateId = dates.reduce((prev, current) =>
    prev.date < current.date ? prev : current
  ).id;

  console.log("Updating: ", leastRecentDateId);

  // Get and process the list with the least recent date
  const list = await getList({ id: leastRecentDateId as ListType, context });

  if (list.results) {
    await processMovies(list.results, context);

    // Update the KV store with the new data
    const data = JSON.stringify({ lastUpdate: new Date().getTime(), ...list });
    await context.env.KV.put(leastRecentDateId, data);
  }

  return json({ status: "ok", updated: leastRecentDateId });
}
