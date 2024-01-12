import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { flag, name } from "country-emoji";
import { humanReadableTime } from "~/utils";
import { getMovie, getProviders } from "~/utils/tmdb/movie.server";
import { BuyRentData, FlatRateData } from "~/utils/tmdb/types";

export async function loader({ context, params }: LoaderFunctionArgs) {
  const { movieId } = params;

  const movie = await getMovie({ id: Number(movieId), context });
  const providers = await getProviders({ id: Number(movieId), context });

  return json({ movie, providers });
}

export default function Movie() {
  const { movie, providers } = useLoaderData<typeof loader>();

  console.log(providers);

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
      <p className="mx-auto max-w-md text-center text-neutral-600 dark:text-neutral-400">
        {movie.overview}
      </p>
      <table className="mt-16 w-full text-left">
        <thead>
          <tr>
            <th className="w-2/3">Country</th>
            <th>Buy</th>
            <th>Rent</th>
            <th>Stream</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(providers.results).length === 0
            ? null
            : Object.entries(providers.results).map(([key, value]) => (
                <tr key={providers.results[key].link}>
                  <Country code={key} />
                  <Information {...value} />
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}

function Country({ code }: { code: string }) {
  return (
    <td className="w-2/3 flex items-center gap-2">
      <span className="w-8 h-8 rounded-full bg-white border border-neutral-100 flex items-center justify-center">
        {flag(code)}
      </span>
      {name(code)}
    </td>
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
        <td>
          <ul className="flex">
            {buy?.map((rate) => (
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

      {rent && rent?.length > 0 ? (
        <td>
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
        </td>
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
