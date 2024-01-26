import { Link, LinkProps } from "@remix-run/react";
import { ReactNode } from "react";
import { cn } from "~/utils";

export default function Option({ children, className, ...rest }: LinkProps) {
  return (
    <div>
      <Link
        {...rest}
        className={cn(
          "text-sm inline-flex items-center whitespace-nowrap px-2 py-1 hover:border-black transition-colors border border-neutral-200 rounded-lg",
          className
        )}
      >
        {children}
      </Link>
    </div>
  );
}

type OptionUnavailableProps = {
  children?: ReactNode;
  className?: string;
};

export function OptionUnavailable({
  children = "Unavailable",
  className,
  ...rest
}: OptionUnavailableProps) {
  return (
    <div>
      <span
        {...rest}
        className={cn(
          "text-sm inline-flex select-none items-center whitespace-nowrap px-2 py-1 border border-neutral-200 rounded-lg text-neutral-400",
          className
        )}
      >
        {children}
      </span>
    </div>
  );
}
