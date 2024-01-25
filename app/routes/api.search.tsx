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

  return json(withoutPeople, {
    headers: { "Cache-Control": "max-age=86400, public" },
  });
}
