import { Link, useFetcher, useNavigation } from "@remix-run/react";
import { useCallback, useEffect, useRef, useState } from "react";
import ActivityIndicator from "~/components/activityIndicator";
import { Input } from "~/components/ui/input";
import { cn } from "~/utils";
import { MovieResult, TvResult } from "~/utils/api/moviedb.types";

export default function Search() {
  const navigation = useNavigation();
  const formRef = useRef<HTMLFormElement>(null);

  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const { data, load, state } = useFetcher<Array<MovieResult | TvResult>>();

  const handleOnBlur = useCallback(() => {
    // Close the dropdown when the user clicks away from the input
    setOpen(false);
  }, []);

  const handleOnFocus = useCallback(() => {
    if (data && data.length > 0) {
      setOpen(true);
    }
  }, [data]);

  useEffect(
    // Get the data from the server
    function searchData() {
      load(`/api/search?q=${query}`);
    },
    [load, query]
  );

  useEffect(() => {
    // If there is data and it's not empty, open the dropdown
    if (data && data.length > 0) {
      setOpen(true);
    }
  }, [data]);

  useEffect(() => {
    // If the user navigates away from the search page, close the dropdown
    if (navigation.location?.pathname) {
      setOpen(false);
      formRef.current?.reset();
    }
  }, [navigation.location?.pathname]);

  return (
    <>
      <div className="relative flex-1">
        <form className="flex items-center relative" ref={formRef}>
          <Input
            className="max-w-xs mx-auto focus:max-w-full transition-all"
            placeholder="Search movies or series..."
            onFocus={handleOnFocus}
            onChange={(event) => setQuery(event.currentTarget.value)}
          />
          {state === "loading" ? (
            <ActivityIndicator size={18} className="!absolute right-4" />
          ) : null}
        </form>

        {open ? (
          <div className={cn("absolute top-full w-full bg-white")}>
            {data && data.length > 0 ? (
              <ul className="grid grid-cols-3">
                {data.map((item) => (
                  <li key={item.id}>
                    <Link to={`/${item.media_type}/${item.id}`}>
                      <img
                        alt=""
                        src={`https://image.tmdb.org/t/p/w500/${item.poster_path}`}
                        className="h-36"
                      />
                      {"title" in item ? item.title : (item as TvResult).name}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}
      </div>
    </>
  );
}
