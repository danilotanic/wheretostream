import { LoaderFunctionArgs, json } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { humanReadableTime } from "~/utils";
import { getMovie } from "~/utils/tmdb/movie.server";

export async function loader({ context, params }: LoaderFunctionArgs) {
  const { movieId } = params;
  const movie = await getMovie({ id: Number(movieId), context });
  return json({ movie });
}

export default function Movie() {
  const { movie } = useLoaderData<typeof loader>();

  console.log(movie);

  return (
    <div className="wrapper border border-neutral-200 rounded-3xl p-4">
      <header className="grid grid-cols-3 text-sm text-neutral-600 dark:text-neutral-400 justify-between">
        <h1 className="text-sm">{movie.title}</h1>
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
    </div>
  );
}
