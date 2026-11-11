import { Badge } from "@/components/ui/badge";

/** A labelled list of technology badges. */
export function TechBadges({ items, label = "Technologies" }: { items: string[]; label?: string }) {
  return (
    <ul aria-label={label} className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <li key={item}>
          <Badge variant="secondary">{item}</Badge>
        </li>
      ))}
    </ul>
  );
}
