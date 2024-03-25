import { useLocation, useParams } from "@remix-run/react";
import { CheckIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

export default function ShareButton() {
  const { id } = useParams();
  const location = useLocation();
  const [copied, setCopied] = useState(false);

  const type = location.pathname.includes("movie") ? "movie" : "tv";

  const handleShare = useCallback(() => {
    if (typeof window !== "undefined") {
      window.navigator.clipboard.writeText(
        `https://whereto.stream/${type}/${id}`
      );
      setCopied(true);
    }
  }, [id, type]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (copied) {
        setCopied(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [copied]);

  return (
    <Button disabled={copied} onClick={handleShare}>
      {copied ? (
        <>
          <CheckIcon size={14} strokeWidth={3} className="mr-1" />
          <span>Link Copied</span>
        </>
      ) : (
        <>
          <span>Share</span>
        </>
      )}
    </Button>
  );
}
