import { LoaderFunctionArgs, defer, json } from "@remix-run/cloudflare";
import { Await, Link, useLoaderData } from "@remix-run/react";
import { flag, name } from "country-emoji";
import { humanReadableTime } from "~/utils";
import { getMovie } from "~/utils/tmdb/movie.server";
import { getSteamingInfo } from "~/utils/api/index.server";
import { BuyRentData, FlatRateData } from "~/utils/tmdb/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Suspense } from "react";

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

  // const defaultValue = provider || Object.values(streamingInfo)?.[0]?.slug; // 1st provider
  // const hasStreamingInfo = Object.keys(streamingInfo).length;
  // const providers = Object.entries(streamingInfo);

  return (
    <div className="wrapper border border-neutral-200 rounded-3xl p-4">
      <header className="grid grid-cols-3 text-sm text-neutral-600 dark:text-neutral-400 justify-between">
        <h1 className="text-sm truncate">{movie.title}</h1>
        <ul className="flex justify-center items-center gap-4">
          {movie.genres.map((genre) => (
            <li key={genre.id}>{genre.name}</li>
          ))}
          <li>{humanReadableTime(movie.runtime)}</li>
        </ul>
        <time className="text-right">
          {new Date(movie.release_date).getFullYear()}
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
            <Tabs className="mt-10" defaultValue={providers[0].slug}>
              <TabsList className="flex gap-2 items-center justify-center">
                {providers.map((provider) => (
                  <TabsTrigger
                    key={provider.slug}
                    value={provider.slug}
                    asChild
                  >
                    <Link
                      preventScrollReset
                      to={`/movie/${movie.id}?provider=${provider.slug}`}
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
                <TabsContent key={provider.slug} value={provider.slug}>
                  <table>
                    <thead>
                      <tr>
                        <th>Country</th>
                        <th>Buy</th>
                        <th>Rent</th>
                        <th>Flatrate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {provider.countries.map((country) => (
                        <tr key={country.code} className="flex items-center">
                          <td>
                            <Country code={country.code} />
                          </td>
                          <td></td>
                          <td></td>
                          <td></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </Await>
      </Suspense>

      {/* {hasStreamingInfo > 0 ? (
        <Tabs className="mt-10" defaultValue={defaultValue}>
          <TabsList className="flex gap-2 items-center justify-center">
            {providers.map(([provider, data]) => (
              <TabsTrigger key={provider} value={provider} asChild>
                <Link
                  preventScrollReset
                  to={`/movie/${movie.id}?provider=${provider}`}
                  className="!flex flex-col after:!hidden bg-neutral-100 rounded-2xl !p-4 data-[state=active]:bg-neutral-200"
                >
                  <span className="w-16 h-16 mb-2 rounded-xl bg-black" />
                  <span className="capitalize">{provider}</span>
                  <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                    {Object.keys(data.countries).length} Countries
                  </span>
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>

          {providers.map(([provider]) => (
            <TabsContent key={provider} value={provider}>
              <ul>
                {Object.entries(streamingInfo[provider].countries).map(
                  ([key, value]) => (
                    <li key={key} className="flex items-center">
                      <Country code={key} />
                      {value.map((item, index) => (
                        <div key={`${item}-${index}`}>
                          {item.streamingType} {item.price?.formatted}
                        </div>
                      ))}
                    </li>
                  )
                )}
              </ul>
            </TabsContent>
          ))}
        </Tabs>
      ) : null} */}
    </div>
  );
}

function Country({ code }: { code: string }) {
  return (
    <div className="w-2/3 flex items-center gap-2">
      <span className="w-8 h-8 rounded-full bg-white border border-neutral-100 flex items-center justify-center">
        {flag(code)}
      </span>
      {name(code)}
    </div>
  );
}

function Information({
  buy,
  rent,
  flatrate,
}: {
  buy?: BuyRentData[];
  rent?: BuyRentData[];
  flatrate?: FlatRateData[];
}) {
  return (
    <>
      {buy && buy?.length > 0 ? (
        <div>
          <ul className="flex">
            {buy?.map((rate) => (
              <li key={rate.provider_id}>
                <Link to="">
                  <img
                    alt={`${rate.provider_name} logo`}
                    src={`https://image.tmdb.org/t/p/w500/${rate.logo_path}`}
                    className="w-8 h-8 rounded-full bg-white border border-neutral-100 flex items-center justify-center"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div></div>
      )}

      {rent && rent?.length > 0 ? (
        <div>
          <ul className="flex">
            {rent?.map((rate) => (
              <li key={rate.provider_id}>
                <img
                  alt={`${rate.provider_name} logo`}
                  src={`https://image.tmdb.org/t/p/w500/${rate.logo_path}`}
                  className="w-8 h-8 rounded-full bg-white border border-neutral-100 flex items-center justify-center"
                />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <td></td>
      )}

      {flatrate && flatrate?.length > 0 ? (
        <td>
          <ul className="flex">
            {flatrate?.map((rate) => (
              <li key={rate.provider_id}>
                <img
                  alt={`${rate.provider_name} logo`}
                  src={`https://image.tmdb.org/t/p/w500/${rate.logo_path}`}
                  className="w-8 h-8 rounded-full bg-white border border-neutral-100 flex items-center justify-center"
                />
              </li>
            ))}
          </ul>
        </td>
      ) : (
        <td></td>
      )}
    </>
  );
}
