import { useFetcher } from "@remix-run/react";
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
  const [value, setValue] = useState("");
  const { open, setOpen } = useSearchContext();

  const search = useFetcher<Array<MovieResult | TvResult>>();

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
      commandProps={{
        value,
        onValueChange: (v) => setValue(v),
      }}
    >
      <CommandInput
        onValueChange={(value) => search.load(`/api/search?q=${value}`)}
      />
      <div className="flex items-start">
        <CommandList className="w-2/5">
          {search.data &&
            search.data.length > 0 &&
            search.data.map((item) => (
              <CommandItem key={item.id} value={`${item.id}`}>
                {"title" in item ? item.title : (item as TvResult).name}
              </CommandItem>
            ))}
        </CommandList>
        <hr className="w-[1px] h-full bg-neutral-200" />
        <div>Preview</div>
      </div>
    </CommandDialog>
  );
}
