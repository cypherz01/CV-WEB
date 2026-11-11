import type { Resume } from "@/data/types";
import { Section } from "./section";
import { TechBadges } from "./tech-badges";

export function Skills({ cv }: { cv: Resume }) {
  return (
    <Section id="skills" title="Skills">
      <div className="flex flex-col gap-5">
        {Object.entries(cv.skills).map(([group, items]) => (
          <div key={group}>
            <h3 className="mb-2 text-sm font-medium text-muted-foreground">{group}</h3>
            <TechBadges items={items} label={group} />
          </div>
        ))}
      </div>
    </Section>
  );
}
