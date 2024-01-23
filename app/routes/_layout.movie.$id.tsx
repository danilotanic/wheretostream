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
import ActivityIndicator from "~/components/activityIndicator";
import { ArrowUpRightIcon } from "lucide-react";

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const { id } = params;

  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") ?? undefined;

  const streamingInfo = getSteamingInfo({
    id: Number(id),
    type: "movie",
    context,
  });

  const details = await getMovie({ id: Number(id), context });

  return defer({ provider, details, streamingInfo });
}

export default function Movie() {
  const {
    provider,
    details,
    streamingInfo: providers,
  } = useLoaderData<typeof loader>();

  return (
    <div className="wrapper w-full border border-neutral-200 rounded-3xl p-4">
      <header className="grid grid-cols-3 text-sm text-neutral-600 dark:text-neutral-400 justify-between">
        <h1 className="text-sm truncate">{details.title}</h1>
        <ul className="flex justify-center items-center gap-4">
          {details.genres?.map((genre) => (
            <li key={genre.id}>{genre.name}</li>
          ))}
          <li>
            {details.runtime ? humanReadableTime(details.runtime) : "N/A"}
          </li>
        </ul>
        <time className="text-right">
          {details.release_date
            ? new Date(details.release_date).getFullYear()
            : "N/A"}
        </time>
      </header>
      <div className="h-56 p-4">
        <img
          alt={`${details.title} poster`}
          src={`https://image.tmdb.org/t/p/w500/${details.poster_path}`}
          className="block h-full mx-auto rounded-2xl shadow-2xl"
        />
      </div>
      <p className="mx-auto text-balance max-w-md text-center text-neutral-600 dark:text-neutral-400">
        {details.overview}
      </p>

      <Suspense
        fallback={
          <div className="flex p-8 items-center justify-center">
            <ActivityIndicator />
          </div>
        }
      >
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
                          <img
                            className="size-16 rounded-xl mb-2"
                            src={`/assets/providers/${provider.slug}.png`}
                            alt={provider.slug}
                          />
                          {/* <span className="capitalize">{provider.slug}</span> */}
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
                                {country.subscription ? (
                                  <Link
                                    to={country.subscription.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm flex items-center whitespace-nowrap px-2 py-1 hover:border-black transition-colors border border-neutral-200 rounded-md"
                                  >
                                    Stream <ArrowUpRightIcon size={16} />
                                  </Link>
                                ) : null}
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
