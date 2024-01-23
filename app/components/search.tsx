import { useFetcher, useNavigate } from "@remix-run/react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  CommandDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
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
  const [key, setKey] = useState(() => Math.random().toString());
  const { open, setOpen } = useSearchContext();
  const search = useFetcher<Array<MovieResult | TvResult>>({ key });

  function resetFetcher() {
    setKey(Math.random().toString());
  }

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
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
      <CommandInput
        onValueChange={(value) => search.load(`/api/search?q=${value}`)}
      />
      <CommandList className="command-list">
        {search.data?.slice(0, 6).map((item) => (
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
            <img
              alt="Poster"
              src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
              className="h-full rounded-2xl"
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
    </CommandDialog>
  );
}
