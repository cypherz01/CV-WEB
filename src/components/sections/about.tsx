import type { Resume } from "@/data/types";
import { formatStat } from "@/lib/cv";
import { NumberTicker } from "@/components/ui/number-ticker";
import { Section } from "./section";

export function About({ cv }: { cv: Resume }) {
  return (
    <Section id="about" title="About">
      <p className="max-w-prose leading-relaxed text-pretty">{cv.about}</p>
      <dl className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {cv.stats.map((stat) => (
          // Value before label visually; <dl> keeps label/value paired for screen readers.
          <div key={stat.label} className="flex flex-col-reverse rounded-xl border p-4">
            <dt className="text-sm text-muted-foreground">{stat.label}</dt>
            <dd className="text-3xl font-semibold tracking-tight tabular-nums">
              <span className="sr-only">{formatStat(stat)}</span>
              <NumberTicker value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
