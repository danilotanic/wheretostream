import {
  Link,
  LinkProps,
  useLocation,
  useSearchParams,
} from "@remix-run/react";
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
  const location = useLocation();
  const { setOpen } = useSearchContext();
  const [searchParams] = useSearchParams();
  const currentFilter =
    location.pathname === "/"
      ? searchParams.get("filter") || "nowPlaying"
      : null;

  return (
    <nav
      className={cn(
        "p-6 sticky bg-neutral-100/80 z-50 backdrop-blur-2xl top-0 w-full py-7 grid-container"
      )}
    >
      <ul className="flex items-center xl:col-span-2 lg:col-span-[1.5] col-span-1">
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
        <SearchIcon className="size-4 flex-shrink-0" />
        Search movies or series...
      </button>

      <div className="flex justify-end items-center xl:col-span-2 col-span-1">
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
