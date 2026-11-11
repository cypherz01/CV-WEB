import type { Resume } from "@/data/types";
import { formatDate, formatDateRange } from "@/lib/cv";
import { Section } from "./section";

export function Education({ cv }: { cv: Resume }) {
  return (
    <Section id="education" title="Education">
      <ul className="flex flex-col gap-4">
        {cv.education.map((entry) => (
          <li
            key={`${entry.qualification}-${entry.end}`}
            className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
          >
            <div>
              <h3 className="font-semibold">{entry.qualification}</h3>
              <p className="text-sm text-muted-foreground">{entry.institution}</p>
            </div>
            <p className="shrink-0 text-sm text-muted-foreground tabular-nums">
              {entry.start ? formatDateRange({ start: entry.start, end: entry.end }) : formatDate(entry.end)}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
