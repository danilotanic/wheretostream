import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { SearchMultiResponse } from "~/utils/api/moviedb.types";
import { getMovieOrSeries } from "~/utils/api/search.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get("q");

  const results = (await getMovieOrSeries({
    context,
    query: query || "",
  })) as SearchMultiResponse["results"];

  const withoutPeople =
    results?.filter((item) => item.media_type !== "person") ?? [];

  return json(withoutPeople.slice(0, 6), {
    // Add a little bit of caching so when the user backspaces a value in the
    // Combobox, the browser has a local copy of the data and doesn't make a
    // request to the server for it. No need to send a client side data fetching
    // library that caches results in memory, the browser has this ability
    // built-in.
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control
    headers: { "Cache-Control": "max-age=60" },
  });
}
