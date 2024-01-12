import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Form, Link, json, useLoaderData } from "@remix-run/react";
import { useCallback, useRef } from "react";
import Card from "~/components/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { ListType, getList } from "~/utils/tmdb/list.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const nowPlaying = await getList({ id: ListType.NowPlaying, context });
  const popular = await getList({ id: ListType.TopRated, context });
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

  console.log(filter);

  const handleFormClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <section className="wrapper">
      <Form className="flex items-center gap-2 py-20" onClick={handleFormClick}>
        <h1 className="flex-shrink-0">Where to stream</h1>
        <Input
          size="lg"
          variant="minimal"
          name="search"
          type="search"
          ref={inputRef}
          placeholder="e.g. the godfather"
        />
      </Form>

      <Tabs defaultValue={filter || "now_playing"}>
        <TabsList>
          <TabsTrigger value="now_playing" asChild>
            <Link to="/?filter=now_playing">Now playing</Link>
          </TabsTrigger>
          <TabsTrigger value="popular" asChild>
            <Link to="/?filter=popular">Popular</Link>
          </TabsTrigger>
          <TabsTrigger value="upcoming" asChild>
            <Link to="/?filter=upcoming">Upcoming</Link>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="now_playing">
          <Carousel className="carousel">
            {nowPlaying.results && nowPlaying.results.length > 0 ? (
              <CarouselContent className="-ml-4">
                {nowPlaying.results.map((movie) => (
                  <CarouselItem
                    key={movie.id}
                    className="md:basis-1/2 pl-4 lg:basis-1/3 "
                  >
                    <Card movie={movie} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            ) : null}
          </Carousel>
        </TabsContent>

        <TabsContent value="popular">
          <Carousel className="carousel">
            {popular.results && popular.results.length > 0 ? (
              <CarouselContent className="-ml-4">
                {popular.results.map((movie) => (
                  <CarouselItem
                    key={movie.id}
                    className="md:basis-1/2 pl-4 lg:basis-1/3 "
                  >
                    <Card movie={movie} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            ) : null}
          </Carousel>
        </TabsContent>

        <TabsContent value="upcoming">
          <Carousel className="carousel">
            {upcoming.results && upcoming.results.length > 0 ? (
              <CarouselContent className="-ml-4">
                {upcoming.results.map((movie) => (
                  <CarouselItem
                    key={movie.id}
                    className="md:basis-1/2 pl-4 lg:basis-1/3 "
                  >
                    <Card movie={movie} />
                  </CarouselItem>
                ))}
              </CarouselContent>
            ) : null}
          </Carousel>
        </TabsContent>
      </Tabs>
    </section>
  );
}
