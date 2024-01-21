import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import {
  Form,
  Link,
  json,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import { useDeferredValue, useEffect, useState } from "react";
import Card from "~/components/card";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Ticker } from "~/components/ui/ticker";
import useAutofocus from "~/hooks/useAutofocus";
import { ListType, getList } from "~/utils/tmdb/list.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const filter = (url.searchParams.get("filter") as ListType) ?? undefined;

  const nowPlaying = await getList({ id: ListType.NowPlaying, context });
  const popular = await getList({ id: ListType.Popular, context });
  const upcoming = await getList({ id: ListType.Upcoming, context });

  return json({ filter, nowPlaying, popular, upcoming });
}

export const meta: MetaFunction = () => {
  return [{ title: "Where to stream?" }];
};

export default function Index() {
  const { filter, nowPlaying, popular, upcoming } =
    useLoaderData<typeof loader>();

  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(() => {
    return searchParams.get("query") ?? "";
  });

  const deferredValue = useDeferredValue(value);
  const inputRef = useAutofocus();

  useEffect(() => {
    setSearchParams({ query: deferredValue });
  }, [deferredValue, setSearchParams]);

  return (
    <section className="flex-1 flex flex-col">
      <Form className="flex w-full wrapper items-center gap-2 py-20 flex-1">
        <h1 className="flex-shrink-0">Where to stream</h1>
        <Input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          size="lg"
          name="query"
          type="search"
          ref={inputRef}
          variant="minimal"
          placeholder="e.g. the godfather"
          onChange={(event) => setValue(event.target.value)}
        />
      </Form>

      <Tabs defaultValue={filter || "now_playing"}>
        <TabsList className="wrapper w-full mx-auto justify-start block">
          <TabsTrigger value="now_playing" asChild>
            <Link to="?filter=now_playing">Now playing</Link>
          </TabsTrigger>
          <TabsTrigger value="popular" asChild>
            <Link to="?filter=popular">Popular</Link>
          </TabsTrigger>
          <TabsTrigger value="upcoming" asChild>
            <Link to="?filter=upcoming">Upcoming</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="now_playing">
          {nowPlaying.results && nowPlaying.results.length > 0 ? (
            <Ticker pauseOnHover className="w-full">
              {nowPlaying.results.map((movie) => (
                <Card key={movie.id} movie={movie} />
              ))}
            </Ticker>
          ) : null}
        </TabsContent>

        <TabsContent value="popular">
          {popular.results && popular.results.length > 0 ? (
            <Ticker pauseOnHover className="w-full">
              {popular.results.map((movie) => (
                <Card key={movie.id} movie={movie} />
              ))}
            </Ticker>
          ) : null}
        </TabsContent>

        <TabsContent value="upcoming">
          {upcoming.results && upcoming.results.length > 0 ? (
            <Ticker pauseOnHover className="w-full">
              {upcoming.results.map((movie) => (
                <Card key={movie.id} movie={movie} />
              ))}
            </Ticker>
          ) : null}
        </TabsContent>
      </Tabs>
    </section>
  );
}
