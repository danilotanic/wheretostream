import { LoaderFunctionArgs, defer } from "@remix-run/cloudflare";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import Country from "~/components/table/country";
import Price from "~/components/table/price";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { humanReadableTime } from "~/utils";
import { getSteamingInfo } from "~/utils/api/streaming.server";
import { getMovie } from "~/utils/api/movie.server";

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const { movieId } = params;

  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") ?? undefined;

  const streamingInfo = getSteamingInfo({
    id: Number(movieId),
    context,
  });

  const movie = await getMovie({ id: Number(movieId), context });

  return defer({ provider, movie, streamingInfo });
}

export default function Movie() {
  const {
    provider,
    movie,
    streamingInfo: providers,
  } = useLoaderData<typeof loader>();

  return (
    <div className="wrapper w-full border border-neutral-200 rounded-3xl p-4">
      <header className="grid grid-cols-3 text-sm text-neutral-600 dark:text-neutral-400 justify-between">
        <h1 className="text-sm truncate">{movie.title}</h1>
        <ul className="flex justify-center items-center gap-4">
          {movie.genres?.map((genre) => (
            <li key={genre.id}>{genre.name}</li>
          ))}
          <li>{movie.runtime ? humanReadableTime(movie.runtime) : "N/A"}</li>
        </ul>
        <time className="text-right">
          {movie.release_date
            ? new Date(movie.release_date).getFullYear()
            : "N/A"}
        </time>
      </header>
      <div className="h-56 p-4">
        <img
          alt={`${movie.title} poster`}
          src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
          className="block h-full mx-auto rounded-2xl shadow-2xl"
        />
      </div>
      <p className="mx-auto text-balance max-w-md text-center text-neutral-600 dark:text-neutral-400">
        {movie.overview}
      </p>

      <Suspense fallback={"loading..."}>
        <Await resolve={providers}>
          {(providers) => (
            <>
              {providers.length > 0 ? (
                <Tabs
                  className="mt-10 w-full max-w-xl mx-auto"
                  defaultValue={provider ?? providers?.[0]?.slug}
                >
                  <TabsList className="flex gap-2 items-center justify-center">
                    {providers.map((provider) => (
                      <TabsTrigger
                        key={provider.slug}
                        value={provider.slug}
                        asChild
                      >
                        <Link
                          preventScrollReset
                          to={`?provider=${provider.slug}`}
                          className="!flex flex-col after:!hidden bg-neutral-100 rounded-2xl !p-4 data-[state=active]:bg-neutral-200"
                        >
                          <span className="w-16 h-16 mb-2 rounded-xl bg-black" />
                          <span className="capitalize">{provider.slug}</span>
                          <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                            {provider.countries.length} Countries
                          </span>
                        </Link>
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {providers.map((provider) => (
                    <TabsContent value={provider.slug} key={provider.slug}>
                      <Table className="table-fixed">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-full">Countries</TableHead>
                            <TableHead className="w-1/3">Rent</TableHead>
                            <TableHead className="w-1/3">Buy</TableHead>
                            <TableHead className="w-1/3">Stream</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {provider.countries.map((country) => (
                            <TableRow key={country.code}>
                              <TableCell className="w-full">
                                <Country code={country.code} />
                              </TableCell>
                              <TableCell className="w-1/3">
                                {country.rent?.price ? (
                                  <Price {...country.rent} />
                                ) : null}
                              </TableCell>
                              <TableCell className="w-1/3">
                                {country.buy?.price ? (
                                  <Price {...country.buy} />
                                ) : null}
                              </TableCell>
                              <TableCell className="w-1/3">
                                {country.subscription?.availableSince}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : null}
            </>
          )}
        </Await>
      </Suspense>
    </div>
  );
}
