import { LoaderFunctionArgs, defer } from "@remix-run/cloudflare";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { ArrowUpRightIcon } from "lucide-react";
import { Suspense } from "react";
import ActivityIndicator from "~/components/activityIndicator";
import Error from "~/components/error";
import Option, { OptionUnavailable } from "~/components/option";
import Country from "~/components/table/country";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn, humanReadableTime } from "~/utils";
import { getMovie } from "~/utils/api/movie.server";
import { getSteamingInfo } from "~/utils/api/streaming.server";

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

  return defer(
    { provider, details, streamingInfo },
    { headers: { "Cache-Control": "max-age=3600, public" } }
  );
}

export default function Movie() {
  const {
    provider,
    details,
    streamingInfo: providers,
  } = useLoaderData<typeof loader>();

  return (
    <div className="w-full px-6 flex-1 flex flex-col">
      <div className="bg-white rounded-3xl p-4 flex-1">
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
        <div className="h-56 my-8">
          <img
            alt={`${details.title} poster`}
            src={`https://image.tmdb.org/t/p/w500/${details.poster_path}`}
            className="block h-full mx-auto rounded-2xl shadow-2xl"
          />
        </div>
        {details.overview ? (
          <p className="mx-auto text-balance max-w-md text-center text-neutral-600 dark:text-neutral-400">
            {details.overview}
          </p>
        ) : null}

        <Suspense
          fallback={
            <div className="flex p-8 items-center justify-center">
              <ActivityIndicator />
            </div>
          }
        >
          <Await resolve={providers} errorElement={<Error />}>
            {(providers) => (
              <>
                {providers.length > 0 ? (
                  <Tabs
                    className="mt-8 w-full max-w-xl mx-auto"
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
                            className={cn(
                              "!flex data-[state=active]:bg-neutral-100 flex-col rounded-2xl !p-4"
                            )}
                          >
                            <img
                              alt={provider.slug}
                              className="size-[60px] rounded-xl mb-2"
                              src={`/assets/providers/${provider.slug}.png`}
                            />
                            <span className="capitalize font-medium">
                              {provider.slug}
                            </span>
                            <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                              {provider.countries.length ?? 0}{" "}
                              {(provider.countries.length ?? 0) === 1
                                ? `country`
                                : `countries`}
                            </span>
                          </Link>
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    {providers.map((provider) => (
                      <TabsContent value={provider.slug} key={provider.slug}>
                        {provider.countries && provider.countries.length > 0 ? (
                          <>
                            <ul className="grid grid-cols-6 mb-4 text-xs gap-4 text-neutral-500">
                              <li className="col-span-3">Countries</li>
                              <li>Rent</li>
                              <li>Buy</li>
                              <li>Stream</li>
                            </ul>
                            <ul>
                              {provider.countries.map((country) => (
                                <li
                                  key={country.code}
                                  className="grid grid-cols-6 my-2 items-center gap-4"
                                >
                                  <Country
                                    code={country.code}
                                    className="col-span-3"
                                  />
                                  {country.rent?.price ? (
                                    <Option
                                      to={country.rent.link}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {country.rent.price.formatted}
                                    </Option>
                                  ) : (
                                    <OptionUnavailable />
                                  )}
                                  {country.buy?.price ? (
                                    <Option
                                      to={country.buy.link}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      {country.buy.price.formatted}
                                    </Option>
                                  ) : (
                                    <OptionUnavailable />
                                  )}
                                  {country.subscription ? (
                                    <Option
                                      to={country.subscription.link}
                                      target="_blank"
                                      rel="noreferrer"
                                    >
                                      Stream <ArrowUpRightIcon size={16} />
                                    </Option>
                                  ) : (
                                    <OptionUnavailable />
                                  )}
                                </li>
                              ))}
                            </ul>
                          </>
                        ) : null}
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : null}
              </>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
