import { forwardRef } from "react";
import { cn } from "~/utils";
import { MovieData } from "~/utils/tmdb.server";

type CardProps = { movie: MovieData } & React.HTMLAttributes<HTMLDivElement>;

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, movie, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "border border-neutral-100 rounded-3xl w-[320px] h-[580px]",
          className
        )}
        {...props}
      >
        <header className="flex text-sm text-neutral-600 dark:text-neutral-400 justify-between px-5 py-4">
          <h3>{movie.title}</h3>
          <time>{new Date(movie.release_date).getFullYear()}</time>
        </header>
        <div className="h-56 p-4">
          <img
            alt={`${movie.title} poster`}
            src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
            className="block h-full mx-auto rounded-2xl shadow-2xl"
          />
        </div>
      </div>
    );
  }
);

Card.displayName = "Card";

export default Card;
