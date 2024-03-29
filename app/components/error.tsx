import { ReactNode } from "react";

type ErrorProps = {
  message?: ReactNode;
};

export default function Error({
  message = "Sorry, we couldn't find any streaming information.",
}: ErrorProps) {
  return (
    <div className="w-full flex-1 flex items-center justify-center p-8 max-w-xl mx-auto text-center text-neutral-400">
      {message}
    </div>
  );
}
