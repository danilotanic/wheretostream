import { LoaderFunctionArgs, defer } from "@remix-run/cloudflare";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import ActivityIndicator from "~/components/activityIndicator";
import Error from "~/components/error";
import Poster from "~/components/poster";
import Providers from "~/components/providers";
import { humanReadableTime } from "~/utils";
import { getSteamingInfo } from "~/utils/api/streaming.server";
import { getShow } from "~/utils/api/tv.server";
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
            {(providers) => (
              <Providers selected={provider} providers={providers} />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
