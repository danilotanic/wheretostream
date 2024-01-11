export default function Footer() {
  return (
    <footer className="wrapper w-full text-neutral-400 dark:text-neutral-600 py-7 text-xs">
      <div className="flex items-center">
        <p className="flex-1">© 2024 WhereToStream</p>
        <p>
          Powered by{" "}
          <a
            href="https://finetune.com"
            target="_blank"
            rel="noreferrer"
            className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
          >
            FineTune
          </a>
        </p>
      </div>
      <p>All external content remains the property of the rightful owner</p>
    </footer>
  );
}
