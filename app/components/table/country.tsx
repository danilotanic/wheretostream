import { name } from "country-emoji";
import { cn } from "~/utils";

export default function Country({
  code,
  className,
}: {
  code: string;
  className?: string;
}) {
  return (
    <div className={cn("w-2/3 flex items-center gap-2", className)}>
      <img src={`/assets/flags/${code}.svg`} alt={name(code)} />
      {name(code)}
    </div>
  );
}
