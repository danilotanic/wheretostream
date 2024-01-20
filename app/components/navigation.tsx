import { Form, Link, useLocation } from "@remix-run/react";
import Logo from "~/components/logo";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

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
          <Form className="flex-1">
            <Input
              className="max-w-xs mx-auto"
              type="search"
              placeholder="Search movies or tv shows..."
            />
          </Form>
          <div className="w-24 flex justify-end">
            <Button>Share</Button>
          </div>
        </>
      ) : null}
    </nav>
  );
}
