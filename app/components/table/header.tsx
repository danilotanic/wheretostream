export default function TableHeader({ keys }: { keys: string[] }) {
  return (
    <ul className="mb-4 sm:flex hidden max-w-xl mx-auto text-xs gap-1 text-neutral-500">
      <li className="flex-1 w-full">Countries</li>
      {keys.map((key) => (
        <li key={`header-${key}`} className="min-w-[100px] capitalize">
          {key}
        </li>
      ))}
    </ul>
  );
}
