import { useFetcher, useNavigate } from "@remix-run/react";
import { SearchIcon } from "lucide-react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import ActivityIndicator from "~/components/activityIndicator";
import Poster from "~/components/poster";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { cn } from "~/utils";
import { MovieResult, TvResult } from "~/utils/api/moviedb.types";

type ContextProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SearchContext = createContext<ContextProps>({
  open: false,
  setOpen: () => {},
});

export function useSearchContext() {
  return useContext(SearchContext);
}

export default function SearchProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const value = useMemo(() => ({ open, setOpen }), [open]);

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
}

export function SearchDialog() {
  const navigate = useNavigate();
  const { open, setOpen } = useSearchContext();
  const [key, setKey] = useState(() => Math.random().toString());
  const search = useFetcher<Array<MovieResult | TvResult>>({ key });

  function resetFetcher() {
    setKey(Math.random().toString());
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Check if the key is a letter (A-Z) or a number (0-9), and no meta keys are pressed
      if (
        /^[a-z0-9]$/i.test(e.key) &&
        !e.metaKey &&
        !e.ctrlKey &&
        !e.altKey &&
        !e.shiftKey
      ) {
        setOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      commandProps={{ shouldFilter: false, className: "w-full" }}
    >
      <div
        className={cn("flex items-center px-4", {
          "border-b": search.data && search.data.length > 0,
        })}
      >
        <SearchIcon className="mr-2 size-4 shrink-0 opacity-50" />
        <CommandInput
          className="flex-1"
          placeholder="Search for movies or series..."
          onValueChange={(value) => search.load(`/api/search?q=${value}`)}
        />
        {search.state === "loading" ? (
          <ActivityIndicator size={16} className="absolute right-7 top-[2px]" />
        ) : null}
      </div>
      {search.data && search.data.length > 0 && (
        <CommandList
          className={cn(
            "[&_>_div]:grid [&_>_div]:grid-cols-3",
            search.data.length === 1 && "[&_>_div]:grid-cols-1",
            search.data.length === 2 && "[&_>_div]:grid-cols-2"
          )}
        >
          {search.data.slice(0, 6).map((item) => (
            <CommandItem
              key={item.id}
              value={`item-${item.id}`}
              className="h-40 group cursor-pointer flex items-start gap-2"
              onSelect={() => {
                navigate(`/${item.media_type}/${item.id}`);
                setOpen(false);
                resetFetcher();
              }}
            >
              <Poster
                path={item.poster_path}
                className="w-[100px] flex-shrink-0 shadow-none"
              />
              <div className="size-full rounded-xl p-4 group-aria-selected:bg-neutral-100">
                <time className="text-xs text-neutral-600">
                  {"release_date" in item
                    ? new Date(item.release_date ?? "").getFullYear()
                    : "first_air_date" in item
                    ? new Date(item.first_air_date ?? "").getFullYear()
                    : "N/A"}
                </time>
                <span className="block">
                  {"title" in item ? item.title : (item as TvResult).name}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandList>
      )}
    </CommandDialog>
  );
}
