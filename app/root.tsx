import type { LinksFunction, MetaFunction } from "@remix-run/cloudflare";
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

import faviconIco from "../public/favicon.ico";
import faviconSvg from "../public/favicon.svg";
import woff2 from "../public/assets/fonts/SuisseIntl-Regular-WebM.woff2";
import appleTouchIcon from "../public/assets/images/icons/apple-touh-icon.png";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
  {
    rel: "preload",
    href: woff2,
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
  { rel: "icon", href: faviconIco, sizes: "any" },
  { rel: "icon", href: faviconSvg, type: "image/svg+xml" },
  { rel: "apple-touch-icon", href: appleTouchIcon },
  { rel: "manifest", href: "/site.webmanifest" },
];

export const meta: MetaFunction = () => {
  const title = "Streaming options for movies & TV shows – whereto.stream";
  const description =
    "Explore international streaming options for movies & TV shows.";

  return [
    {
      title,
    },
    {
      name: "description",
      content: description,
    },
    {
      name: "referrer",
      content: "origin-when-cross-origin",
    },
    {
      property: "og:title",
      content: title,
    },
    {
      property: "og:type",
      content: "website",
    },
    {
      property: "og:image",
      content: "https://whereto.stream/assets/images/social.png",
    },
    {
      property: "og:url",
      content: "https://whereto.stream",
    },
    {
      property: "og:description",
      content: description,
    },
    {
      property: "og:site_name",
      content: title,
    },
    {
      property: "og:image:alt",
      content: title,
    },
    {
      name: "twitter:card",
      content: "summary_large_image",
    },
    {
      name: "twitter:title",
      content: title,
    },
    {
      name: "twitter:description",
      content: description,
    },
    {
      name: "twitter:image",
      content: "https://whereto.stream/assets/images/social.png",
    },
    {
      name: "twitter:image:alt",
      content: title,
    },
    {
      name: "twitter:creator",
      content: "@gielcobben",
    },
  ];
};

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
      <body className="bg-neutral-100 text-sm antialiased font-sans text-black">
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
