import { LoaderFunctionArgs, MetaFunction, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import Card from "~/components/card";
import { ListType, getList } from "~/utils/api/list.server";

export const meta: MetaFunction = () => {
  return [{ title: "Where to stream?" }];
};

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const filter = (url.searchParams.get("filter") as ListType) ?? undefined;

  const nowPlaying = await context.env.KV.get("nowPlaying", { type: "json" });
  const popular = await context.env.KV.get("popular", { type: "json" });
  const upcoming = await context.env.KV.get("upcoming", { type: "json" });

  // const nowPlaying = await getList({ id: ListType.NowPlaying, context });
  // const popular = await getList({ id: ListType.Popular, context });
  // const upcoming = await getList({ id: ListType.Upcoming, context });

  return json({ filter, nowPlaying, popular, upcoming });
}

export default function Home() {
  const { filter, nowPlaying, popular, upcoming } =
    useLoaderData<typeof loader>();

  const data = { nowPlaying, popular, upcoming };
  const currentList = data[filter ?? "nowPlaying"];

  console.log(JSON.stringify(upcoming));

  return (
    <section className="grid-container px-6">
      {currentList.results && currentList.results.length > 0 ? (
        <>
          {currentList.results.map((movie) => (
            <Card key={movie.id} movie={movie} />
          ))}
        </>
      ) : null}
    </section>
  );
}
