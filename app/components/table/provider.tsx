import { Link } from "@remix-run/react";
import { cn } from "~/utils";
import { Provider as RapidProviderProps } from "~/utils/api/rapidapi.types";

type ProviderProps = RapidProviderProps & {
  selected?: string;
  className?: string;
};

export default function Provider({
  slug,
  selected,
  countries,
  className,
}: ProviderProps) {
  return (
    <Link
      prefetch="intent"
      preventScrollReset
      to={`?provider=${slug}`}
      className={cn(
        "!flex flex-shrink-0 w-full text-center data-[state=active]:bg-neutral-100 flex-col rounded-2xl !p-4",
        slug === selected ? "bg-neutral-100" : "",
        className
      )}
    >
      <img
        alt={slug}
        className="size-[60px] mx-auto rounded-xl mb-2"
        src={`/assets/providers/${slug}.png`}
      />
      <span className="capitalize font-medium">{slug}</span>
      <span className="text-neutral-600 dark:text-neutral-400 text-sm">
        {countries.length ?? 0}{" "}
        {(countries.length ?? 0) === 1 ? `country` : `countries`}
      </span>
    </Link>
  );
}
