import { name } from "country-emoji";
import { CircleFlag } from "react-circle-flags";
import { cn } from "~/utils";

export default function Country({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  return (
    <div className={cn("w-full flex-1 flex items-center gap-2", className)}>
      <CircleFlag countryCode={code} className="size-[18px]" />
      {name(code)}
    </div>
  );
}
