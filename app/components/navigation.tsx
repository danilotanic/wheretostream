import { Link, useLocation } from "@remix-run/react";
import { SearchIcon } from "lucide-react";
import Logo from "~/components/logo";
import { useSearchContext } from "~/components/search";
import { Button } from "~/components/ui/button";

export default function Navigation() {
  const location = useLocation();
  const isHomepage = location.pathname === "/";
  const { setOpen } = useSearchContext();

  return (
    <nav className="wrapper w-full py-7 flex items-center">
      <div className="w-24">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      {!isHomepage ? (
        <>
          <button
            onClick={() => setOpen(true)}
            className="py-2 flex items-center gap-2 justify-center px-4 w-full max-w-xs mx-auto text-neutral-600 bg-neutral-200 rounded-lg text-sm"
          >
            <SearchIcon className="size-4" />
            Search movies or series...
          </button>

          <div className="w-24 flex justify-end">
            <Button>Share</Button>
          </div>
        </>
      ) : null}
    </nav>
  );
}
