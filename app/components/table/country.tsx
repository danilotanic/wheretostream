import { flag, name } from "country-emoji";

export default function Country({ code }: { code: string }) {
  return (
    <div className="w-2/3 flex items-center gap-2">
      <span className="w-8 h-8 rounded-full bg-white border border-neutral-100 flex items-center justify-center">
        {flag(code)}
      </span>
      {name(code)}
    </div>
  );
}
