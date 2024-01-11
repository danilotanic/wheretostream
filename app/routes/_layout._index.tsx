import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Form, json, useLoaderData } from "@remix-run/react";
import { useCallback, useRef } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "~/components/ui/carousel";
import { Input } from "~/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { getUpcoming } from "~/utils/tmdb.server";

export async function loader({ context }: LoaderFunctionArgs) {
  const upcoming = await getUpcoming({ context });

  return json({ upcoming });
}

export const meta: MetaFunction = () => {
  return [{ title: "Where to stream?" }];
};

export default function Index() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upcoming } = useLoaderData<typeof loader>();

  const handleFormClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <section className="wrapper">
      <Form className="flex items-center gap-2 my-20" onClick={handleFormClick}>
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

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="popular">Popular</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>
        <TabsContent value="upcoming">
          <Carousel>
            {upcoming.results && upcoming.results.length > 0 ? (
              <CarouselContent className="-ml-4">
                {upcoming.results.map((movie) => (
                  <CarouselItem
                    key={movie.id}
                    className="md:basis-1/2 pl-4 lg:basis-1/3 "
                  >
                    <div className="border border-neutral-100">
                      <h3 className="text-center">{movie.title}</h3>
                      <img
                        width={150}
                        alt={`${movie.title} poster`}
                        src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                        className="block mx-auto"
                      />
                    </div>
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
