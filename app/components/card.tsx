import { Link } from "@remix-run/react";
import { ChevronRightIcon } from "lucide-react";
import { forwardRef } from "react";
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
          "bg-white group rounded-3xl text-neutral-500 duration-300 hover:duration-100 hover:bg-neutral-200/40 transition-colors",
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
        <div className="h-[260px] p-4">
          <Link to={`/movie/${movie.id}`} prefetch="intent">
            <img
              loading="lazy"
              alt={`${movie.title} poster`}
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              className="block h-full mx-auto rounded-2xl shadow-2xl shadow-black/35"
            />
          </Link>
        </div>
        <footer className="flex justify-between p-4">
          <span>
            Streaming in {movie.countries ?? 0}{" "}
            {(movie.countries ?? 0) === 1 ? `country` : `countries`}
          </span>
          <span className="text-black flex translate-x-3 transition-transform group-hover:translate-x-0 items-center">
            See where{" "}
            <ChevronRightIcon className="size-4 transition-opacity opacity-0 group-hover:opacity-100" />
          </span>
        </footer>
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
