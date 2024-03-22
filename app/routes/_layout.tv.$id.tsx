import { LoaderFunctionArgs, defer } from "@remix-run/cloudflare";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import ActivityIndicator from "~/components/activityIndicator";
import Error from "~/components/error";
import Country from "~/components/table/country";
import Option, { OptionUnavailable } from "~/components/table/option";
import Provider from "~/components/table/provider";
import ProvidersCarousel from "~/components/table/providersCarousel";
import TableHeader from "~/components/table/header";
import { humanReadableTime } from "~/utils";
import {
  Country as CountryProps,
  Option as OptionProps,
} from "~/utils/api/rapidapi.types";
import { getSteamingInfo } from "~/utils/api/streaming.server";
import { getShow } from "~/utils/api/tv.server";
import Poster from "~/components/poster";
import { getLocation } from "~/utils/getlocation.server";

export async function loader({ request, context, params }: LoaderFunctionArgs) {
  const { id } = params;

  const url = new URL(request.url);
  const provider = url.searchParams.get("provider") ?? undefined;
  const location = getLocation(request.headers);

  const streamingInfo = getSteamingInfo({
    id: Number(id),
    type: "tv",
    context,
    location,
  });

  const details = await getShow({ id: Number(id), context });

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
          <h1 className="text-sm truncate">{details.name}</h1>
          <ul className="flex justify-center items-center gap-4">
            {details.genres?.map((genre) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
            <li>
              {details.episode_run_time
                ? `~${humanReadableTime(
                    Number(details.last_episode_to_air?.runtime) ?? 0
                  )}`
                : "N/A"}
            </li>
          </ul>
          <time className="text-right">
            {details.first_air_date
              ? new Date(details.first_air_date).getFullYear()
              : "N/A"}
          </time>
        </header>
        <div className="h-56 p-4">
          <Poster name={details.name} path={details.poster_path} />
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

              console.log(availableKeys);

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

                                {availableKeys.map((key) => {
                                  const item = country[key] as OptionProps;

                                  return (
                                    <>
                                      {item && item.link ? (
                                        <Option to={item.link}>
                                          {item?.price
                                            ? item?.price.formatted
                                            : "Stream"}
                                        </Option>
                                      ) : country.user ? (
                                        <p>VPN</p>
                                      ) : (
                                        <OptionUnavailable />
                                      )}
                                    </>
                                  );
                                })}
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
