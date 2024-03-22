import { Link } from "@remix-run/react";

export default function Footer() {
  return (
    <footer className="w-full p-6 text-neutral-400 dark:text-neutral-600 text-center md:text-left text-xs md:flex justify-between">
      <p className="flex-1">
        <Link target="_blank" rel="noreferrer" to="https://finetune.co/">
          © 2024 FineTune Studio
        </Link>
      </p>
      <p>All external content remains the property of the rightful owner</p>
    </footer>
  );
}
