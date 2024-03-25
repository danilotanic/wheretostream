import { LoaderFunctionArgs, defer } from "@remix-run/cloudflare";
import { Await, useLoaderData } from "@remix-run/react";
import { Suspense } from "react";
import ActivityIndicator from "~/components/activityIndicator";
import Error from "~/components/error";
import Poster from "~/components/poster";
import Providers from "~/components/providers";
import { humanReadableTime } from "~/utils";
import { getMovie } from "~/utils/api/movie.server";
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
            {(providers) => (
              <Providers selected={provider} providers={providers} />
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
