import type { LinksFunction } from "@remix-run/cloudflare";
import { cssBundleHref } from "@remix-run/css-bundle";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigation,
} from "@remix-run/react";
import styles from "./tailwind.css";
import NProgress from "nprogress";
import { useEffect, useRef } from "react";
import SearchProvider from "~/components/search";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  const navigation = useNavigation();
  const timer = useRef<number | null>(null); // Type for timer

  // Clear the timer when the component unmounts to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    // when the state is idle then we can to complete the progress bar
    if (navigation.state === "idle") {
      if (timer.current) clearTimeout(timer.current);
      NProgress.done();
    }
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    else if (!navigation.location?.state?.isSearching) {
      // Clear any existing timer
      if (timer.current) clearTimeout(timer.current);
      // Set a new timer to start the progress bar after 500ms
      timer.current = setTimeout(() => {
        NProgress.start();
      }, 500) as unknown as number; // Delay of 500ms
    }
  }, [navigation]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-white dark:bg-black text-black dark:text-white">
        <SearchProvider>
          <Outlet />
        </SearchProvider>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
