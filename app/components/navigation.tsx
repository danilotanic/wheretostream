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
        "after:absolute text-neutral-500 hover:text-black transition-colors relative after:bottom-0 after:left-1/2 after:-ml-[2px] after:w-1 after:h-1 after:hidden after:bg-black after:rounded-full",
        { "after:block text-black": props.active },
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
      ? searchParams.get("filter") || "popular"
      : undefined;

  return (
    <nav
      className={cn(
        "px-6 sticky bg-neutral-100/80 z-50 backdrop-blur-2xl top-0 w-full py-7 lg:grid grid-cols-5"
      )}
    >
      <ul className="flex items-center col-span-1 xl:col-span-2 justify-center lg:justify-start">
        <li>
          <Link to="/" className="pr-3 block">
            <Logo />
          </Link>
        </li>
        <li>
          <NavLink
            prefetch="intent"
            to="/?filter=popular"
            className="px-3 py-2 block"
            active={currentFilter === "popular"}
          >
            Popular
          </NavLink>
        </li>
        <li>
          <NavLink
            prefetch="intent"
            to="/?filter=upcoming"
            className="px-3 py-2 block"
            active={currentFilter === "upcoming"}
          >
            Upcoming
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/?filter=new"
            prefetch="intent"
            className="px-3 py-2 block"
            active={currentFilter === "new"}
          >
            Updated
          </NavLink>
        </li>
      </ul>

      <button
        onClick={() => setOpen(true)}
        className="flex items-center mt-2 lg:mt-0 hover:bg-neutral-300/70 col-span-3 xl:col-span-1 transition-colors gap-2 py-1.5 justify-center px-4 h-10 w-full lg:max-w-sm xl:max-w-full mx-auto text-neutral-600 bg-neutral-200/70 rounded-full text-sm"
      >
        <SearchIcon className="size-4 flex-shrink-0" />
        Search for movies or series...
      </button>

      <div className="items-center hidden lg:flex xl:col-span-2 col-span-1 justify-center lg:justify-end">
        <Link
          target="_blank"
          rel="noreferrer"
          to="https://finetune.co/"
          className="text-neutral-600"
        >
          Powered by <span className="text-black">FineTune</span>
        </Link>
      </div>
    </nav>
  );
}
