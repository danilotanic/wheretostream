import { Link } from "@remix-run/react";
import { Option } from "~/utils/api/rapidapi.types";

export default function Price({ link, price }: Option) {
  return (
    <Link
      to={link}
      className="text-sm whitespace-nowrap px-2 py-1 hover:border-black transition-colors border border-neutral-200 rounded-full"
    >
      {price?.formatted}
    </Link>
  );
}
