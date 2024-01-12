import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Form, json, useLoaderData } from "@remix-run/react";
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

export async function loader({ context }: LoaderFunctionArgs) {
  const nowPlaying = await getList({ id: ListType.NowPlaying, context });
  const popular = await getList({ id: ListType.Popular, context });
  const upcoming = await getList({ id: ListType.Upcoming, context });

  return json({ nowPlaying, popular, upcoming });
}

export const meta: MetaFunction = () => {
  return [{ title: "Where to stream?" }];
};

export default function Index() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { nowPlaying, popular, upcoming } = useLoaderData<typeof loader>();

  console.log({ nowPlaying, popular, upcoming });

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

      <Tabs defaultValue="nowPlaying">
        <TabsList>
          <TabsTrigger value="nowPlaying">New</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>

        <TabsContent value="nowPlaying">
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
