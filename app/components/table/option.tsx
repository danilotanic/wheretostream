import { Link, LinkProps } from "@remix-run/react";
import { ReactNode } from "react";
import ExpressVPNLogo from "~/components/table/logoVPN";
import { cn } from "~/utils";

export default function Option({ children, className, ...rest }: LinkProps) {
  return (
    <div className={cn("min-w-[100px]", className)}>
      <Link
        {...rest}
        className="text-sm inline-flex items-center whitespace-nowrap px-2 py-1 hover:border-black transition-colors border border-neutral-200 rounded-lg"
        target="_blank"
        rel="noopener noreferrer"
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
    <div className={cn("min-w-[100px]", className)}>
      <span
        {...rest}
        className="text-sm inline-flex select-none items-center whitespace-nowrap px-2 py-1 border border-neutral-200 rounded-lg text-neutral-400"
      >
        {children}
      </span>
    </div>
  );
}

export function OptionVPN({
  children = (
    <>
      <ExpressVPNLogo className="mr-1" /> Stream with ExpressVPN
    </>
  ),
  className,
  ...rest
}: OptionUnavailableProps) {
  return (
    <div className={cn("min-w-[100px]", className)}>
      <span
        {...rest}
        className="text-sm inline-flex select-none items-center whitespace-nowrap px-2 py-1 border border-red-200 text-[#DA3940] hover:text-white hover:bg-[#DA3940] hover:border-[#DA3940] transition-all rounded-lg"
      >
        {children}
      </span>
    </div>
  );
}
