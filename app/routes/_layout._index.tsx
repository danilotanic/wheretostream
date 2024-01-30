import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Card from "~/components/card";
import { ListType, getList } from "~/utils/api/list.server";
import { DiscoverMovieResponse } from "~/utils/api/moviedb.types";

export const meta: MetaFunction = () => {
  return [{ title: "Where to stream?" }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const filter = (url.searchParams.get("filter") as ListType) ?? undefined;

  if (process.env.NODE_ENV !== "development") {
    const data: DiscoverMovieResponse | null = await context.env.KV.get(
      filter ?? ListType.NowPlaying,
      {
        type: "json",
      }
    );

    console.log("server: ", data?.lastUpdate ?? "no data");

    return json(
      { filter, data },
      { headers: { "Cache-Control": "max-age=86400, public" } }
    );
  } else {
    const data = await getList({ id: filter ?? ListType.NowPlaying, context });
    return json(
      { filter, data },
      { headers: { "Cache-Control": "max-age=86400, public" } }
    );
  }
}

export default function Home() {
  const { data } = useLoaderData<typeof loader>();

  console.log("client: ", data?.lastUpdate ?? "no data");

  return (
    <section className="grid-container px-6">
      {data?.results && data.results.length > 0 ? (
        <>
          {data.results.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </>
      ) : null}
    </section>
  );
}
