import { ImageIcon } from "lucide-react";
import { cn } from "~/utils";

export default function Poster({
  path,
  name,
  className,
}: {
  name?: string | null;
  path?: string | null;
  className?: string;
}) {
  return (
    <>
      {path ? (
        <img
          loading="lazy"
          alt={`${name} poster`}
          src={`https://image.tmdb.org/t/p/w500/${path}`}
          className={cn(
            "block h-full mx-auto rounded-2xl shadow-2xl",
            className
          )}
        />
      ) : (
        <div
          className={cn(
            "h-full max-w-[128px] bg-neutral-100 mx-auto rounded-2xl shadow-2xl flex items-center justify-center",
            className
          )}
        >
          <ImageIcon />
        </div>
      )}
    </>
  );
}
