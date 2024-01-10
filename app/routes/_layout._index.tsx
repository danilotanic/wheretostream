import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/cloudflare";
import { Form, json, useLoaderData } from "@remix-run/react";
import { useCallback, useRef } from "react";
import { Input } from "~/components/ui/input";

export async function loader({ context }: LoaderFunctionArgs) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/upcoming`, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${context.env.TMDB_ACCESS_TOKEN}`,
    },
  });
  const data = await response.json();

  return json({ data });
}

export const meta: MetaFunction = () => {
  return [{ title: "Where to stream?" }];
};

export default function Index() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { data } = useLoaderData<typeof loader>();

  console.log("CLIENT: ", data);

  const handleFormClick = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <section className="wrapper">
      <Form className="flex items-center gap-2 my-20" onClick={handleFormClick}>
        <h1 className="flex-shrink-0">Where to stream</h1>
        <Input
          ref={inputRef}
          name="search"
          type="search"
          placeholder="e.g. the godfather"
        />
      </Form>
    </section>
  );
}
