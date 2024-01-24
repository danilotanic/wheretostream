import { Link, LinkProps, useSearchParams } from "@remix-run/react";
import { SearchIcon } from "lucide-react";
import Logo from "~/components/logo";
import { useSearchContext } from "~/components/search";
import { cn } from "~/utils";

function NavLink(props: LinkProps & { active?: boolean }) {
  return (
    <Link
      {...props}
      className={cn(
        "after:absolute relative after:bottom-0 after:left-1/2 after:-ml-[2px] after:w-1 after:h-1 after:hidden after:bg-black after:rounded-full",
        props.active && "after:block",
        props.className
      )}
    />
  );
}

export default function Navigation() {
  const { setOpen } = useSearchContext();
  const [searchParams] = useSearchParams();
  const currentFilter = searchParams.get("filter") || "nowPlaying";

  return (
    <nav
      className={cn(
        "p-6 sticky bg-neutral-100/80 z-50 backdrop-blur-2xl top-0 w-full py-7 grid grid-cols-3"
        // "after:absolute after:top-[88px] after:left-6 after:hidden after:h-10 after:w-5 after:rounded-tl-2xl after:bg-white after:shadow-[0_-25px_0_0] after:shadow-neutral-100 dark:after:bg-neutral-800  dark:after:shadow-neutral-900 lg:after:block"
      )}
    >
      <ul className="flex items-center">
        <li>
          <Link to="/" className="pr-3 block">
            <Logo />
          </Link>
        </li>
        <li>
          <NavLink
            to="/"
            className="px-3 py-2 block"
            active={currentFilter === "nowPlaying"}
          >
            New
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/?filter=popular"
            className="px-3 py-2 block"
            active={currentFilter === "popular"}
          >
            Popular
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/?filter=upcoming"
            className="px-3 py-2 block"
            active={currentFilter === "upcoming"}
          >
            Upcoming
          </NavLink>
        </li>
      </ul>

      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 py-1.5 justify-center px-4 w-full max-w-xs mx-auto text-neutral-600 bg-neutral-200 rounded-lg text-sm"
      >
        <SearchIcon className="size-4" />
        Search movies or series...
      </button>

      <div className="flex justify-end items-center">
        <Link
          target="_blank"
          rel="noreferrer"
          to="https://finetune.co/"
          className="text-neutral-600"
        >
          Powered by <span className="text-black">Finetune</span>
        </Link>
      </div>
    </nav>
  );
}
