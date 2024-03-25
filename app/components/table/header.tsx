export default function TableHeader({ keys }: { keys: string[] }) {
  return (
    <ul className="flex mb-4 max-w-xl mx-auto text-xs gap-4 text-neutral-500">
      <li className="flex-1 w-full">Countries</li>
      {keys.map((key) => (
        <li key={`header-${key}`} className="min-w-[100px] capitalize">
          {key}
        </li>
      ))}
    </ul>
  );
}
