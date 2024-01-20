import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Form, Link, json, useLoaderData } from "@remix-run/react";
import { useEffect, useRef } from "react";
import Card from "~/components/card";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Ticker } from "~/components/ui/ticker";
import { ListType, getList } from "~/utils/tmdb/list.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const nowPlaying = await getList({ id: ListType.NowPlaying, context });
  const popular = await getList({ id: ListType.Popular, context });
  const upcoming = await getList({ id: ListType.Upcoming, context });

  const url = new URL(request.url);
  const filter = (url.searchParams.get("filter") as ListType) ?? undefined;

  return json({ filter, nowPlaying, popular, upcoming });
}

export const meta: MetaFunction = () => {
  return [{ title: "Where to stream?" }];
};

export default function Index() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { filter, nowPlaying, popular, upcoming } =
    useLoaderData<typeof loader>();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 10);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      // List of keys that should allow default browser behavior
      const allowedKeys = [
        "F5",
        "F12",
        "Tab",
        "Control",
        "Meta",
        "Alt",
        "Escape",
      ];
      if (allowedKeys.includes(event.key)) {
        return; // Skip refocusing for these keys
      }

      // Refocus the input for other keys
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 10);
      }
    };

    // Bind the event listeners
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      // Unbind the event listeners on clean up
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []); // Dependencies array remains empty as we don't need to re-run this effect based on any changing props or state.

  return (
    <section className="flex-1 flex flex-col">
      <Form className="flex w-full wrapper items-center gap-2 py-20 flex-1">
        <h1 className="flex-shrink-0">Where to stream</h1>
        <Input
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          size="lg"
          name="search"
          type="search"
          ref={inputRef}
          variant="minimal"
          placeholder="e.g. the godfather"
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
