import { name } from "country-emoji";
import { CircleFlag } from "react-circle-flags";
import { OptionVPN } from "~/components/table/option";
import { cn } from "~/utils";
import { Country as CountryProps } from "~/utils/api/rapidapi.types";

export default function Country({
  code,
  buy,
  rent,
  subscription,
  user,
  className,
}: CountryProps & {
  className?: string;
}) {
  return (
    <div className={cn("w-full flex-1 flex items-center gap-2", className)}>
      <CircleFlag countryCode={code} className="size-[18px]" />
      {name(code)}
      {user && !buy && !rent && !subscription ? <OptionVPN /> : null}
    </div>
  );
}
