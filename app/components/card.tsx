import { Link } from "@remix-run/react";
import { ChevronRightIcon } from "lucide-react";
import { forwardRef } from "react";
import Poster from "~/components/poster";
import { cn } from "~/utils";
import { MovieResult } from "~/utils/api/moviedb.types";

type CardProps = {
  movie: MovieResult;
} & React.HTMLAttributes<HTMLDivElement>;

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, movie, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white group min-w-0 rounded-3xl text-neutral-500 duration-300 hover:duration-100 hover:bg-neutral-200/40 transition-colors xl:aspect-[2/2.2] flex flex-col",
          className
        )}
        {...props}
      >
        <header className="flex gap-4 justify-between p-4">
          <h3 className="truncate">{movie.title}</h3>
          <time>
            {movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "N/A"}
          </time>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div className="max-h-64 h-full p-4 2xl:max-h-80">
            <Link to={`/movie/${movie.id}`} prefetch="intent">
              <Poster name={movie.title} path={movie.poster_path} />
            </Link>
          </div>
        </div>
        <footer className="flex justify-between p-4">
          <span>
            Streaming in {movie.countries ?? 0}{" "}
            {(movie.countries ?? 0) === 1 ? `country` : `countries`}
          </span>
          <Link
            to={`/movie/${movie.id}`}
            prefetch="intent"
            className="text-black flex translate-x-3 transition-transform group-hover:translate-x-0 items-center"
          >
            See where{" "}
            <ChevronRightIcon className="size-4 transition-opacity opacity-0 group-hover:opacity-100" />
          </Link>
        </footer>
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
