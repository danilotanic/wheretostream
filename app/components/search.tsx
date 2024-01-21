import { useFetcher } from "@remix-run/react";
import { useCallback, useEffect, useState } from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import { MovieListData } from "~/utils/tmdb/types";

export default function Search() {
  const fetcher = useFetcher<MovieListData[]>();

  return (
    <>
      <Command shouldFilter={false} className="relative">
        <CommandInput
          placeholder="Search movies or series..."
          onValueChange={(query) =>
            fetcher.load(`/resources/search?q=${query}`)
          }
        />
        <CommandList className="absolute top-full w-full bg-white">
          {fetcher.data && fetcher.data.length > 0
            ? fetcher.data.map((item) => (
                <CommandItem key={item.id}>{item.title}</CommandItem>
              ))
            : null}
        </CommandList>
      </Command>
    </>
  );
}
