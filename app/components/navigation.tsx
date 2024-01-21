import { Link, useLocation } from "@remix-run/react";
import Logo from "~/components/logo";
import Search from "~/components/search";
import { Button } from "~/components/ui/button";

export default function Navigation() {
  const location = useLocation();
  const isHomepage = location.pathname === "/";

  return (
    <nav className="wrapper w-full py-7 flex items-center">
      <div className="w-24">
        <Link to="/">
          <Logo />
        </Link>
      </div>

      {!isHomepage ? (
        <>
          <Search />
          <div className="w-24 flex justify-end">
            <Button>Share</Button>
          </div>
        </>
      ) : null}
    </nav>
  );
}
