import { LoaderFunctionArgs, defer } from "@remix-run/cloudflare";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import ActivityIndicator from "~/components/activityIndicator";
import Error from "~/components/error";
import Poster from "~/components/poster";
import Country from "~/components/table/country";
import TableHeader from "~/components/table/header";
import Option, { OptionUnavailable } from "~/components/table/option";
import Provider from "~/components/table/provider";
import ProvidersCarousel from "~/components/table/providersCarousel";
import { humanReadableTime } from "~/utils";
import { getMovie } from "~/utils/api/movie.server";
import {
  Country as CountryProps,
  Option as OptionProps,
} from "~/utils/api/rapidapi.types";
import { getSteamingInfo } from "~/utils/api/streaming.server";
import { getLocation } from "~/utils/getlocation.server";

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const { id } = params;

  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") ?? undefined;
  const location = getLocation(request.headers);

  const streamingInfo = getSteamingInfo({
    id: Number(id),
    type: "movie",
    context,
    location,
  });

  const details = await getMovie({ id: Number(id), context });

  return defer(
    { provider, details, streamingInfo, location },
    { headers: { "Cache-Control": "max-age=86400, public" } }
  );
}

type CountryKey = keyof CountryProps;

export default function Movie() {
  const {
    provider,
    details,
    streamingInfo: providers,
  } = useLoaderData<typeof loader>();

  return (
    <div className="w-full px-6 flex-1 flex flex-col">
      <div className="bg-white flex flex-col rounded-3xl p-4 flex-1">
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
          <Poster name={details.title} path={details.poster_path} />
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
            {(providers) => {
              if (providers.length === 0) return <Error />;

              console.log(providers);

              const selected = providers.find(
                (p) => p.slug === (provider ?? providers?.[0]?.slug)
              );

              const keysToCheck: CountryKey[] = ["buy", "rent", "subscription"];
              const availableKeys: CountryKey[] = [];

              keysToCheck.forEach((key) => {
                if (selected?.countries.some((obj) => key in obj)) {
                  availableKeys.push(key);
                }
              });

              return (
                <>
                  <div className="w-full">
                    <div className="max-w-xl mx-auto w-full">
                      {providers.length <= 4 ? (
                        <ul className="flex my-8 justify-center gap-2 items-center">
                          {providers.map((provider) => (
                            <Provider
                              {...provider}
                              key={provider.slug}
                              selected={selected?.slug}
                              className="w-[132px]"
                            />
                          ))}
                        </ul>
                      ) : null}

                      {providers.length > 4 ? (
                        <ProvidersCarousel
                          selected={selected}
                          providers={providers}
                        />
                      ) : null}
                    </div>

                    {selected?.countries && selected.countries.length > 0 ? (
                      <>
                        <TableHeader keys={availableKeys} />
                        <ul className="max-w-3xl mx-auto">
                          {selected.countries.map((country) => (
                            <li
                              key={country.code}
                              className="transition-colors duration-300 hover:duration-100 py-1.5 rounded-lg hover:bg-neutral-100"
                            >
                              <div className="max-w-xl mx-auto flex items-center gap-4">
                                <Country code={country.code} />

                                {country.user &&
                                !country.buy &&
                                !country.rent &&
                                !country.subscription ? (
                                  <p>VPN</p>
                                ) : (
                                  availableKeys.map((key) => {
                                    const item = country[key] as OptionProps;

                                    return (
                                      <>
                                        {item && item.link ? (
                                          <Option to={item.link}>
                                            {item?.price
                                              ? item?.price.formatted
                                              : "Stream"}
                                          </Option>
                                        ) : (
                                          <OptionUnavailable />
                                        )}
                                      </>
                                    );
                                  })
                                )}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </>
                    ) : (
                      <Error />
                    )}
                  </div>
                </>
              );
            }}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
