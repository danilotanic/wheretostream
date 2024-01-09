import type { MetaFunction } from "@remix-run/cloudflare";

export const meta: MetaFunction = () => {
  return [{ title: "Where to stream?" }];
};

export default function Index() {
  return (
    <div>
      <h1>Welcome to Whereto.stream</h1>
    </div>
  );
}
