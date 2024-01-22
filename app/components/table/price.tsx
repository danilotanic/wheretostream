import { Link } from "@remix-run/react";
import { APIOption } from "~/utils/api/streaming.server";

export default function Price({ link, price }: APIOption) {
  return (
    <Link
      to={link}
      className="text-sm whitespace-nowrap px-2 py-1 hover:border-black transition-colors border border-neutral-200 rounded-md"
    >
      {price?.formatted}
    </Link>
  );
}
