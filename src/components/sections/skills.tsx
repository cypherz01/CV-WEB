import type { Resume } from "@/data/types";
import { Section } from "./section";
import { SkillsCloud } from "./skills-cloud";
import { TechBadges } from "./tech-badges";

export function Skills({ cv }: { cv: Resume }) {
  return (
    <Section id="skills" title="Skills">
      <div className="flex items-center gap-8">
        <div className="flex flex-1 flex-col gap-5">
          {Object.entries(cv.skills).map(([group, items]) => (
            <div key={group}>
              <h3 className="mb-2 text-sm font-medium text-muted-foreground">{group}</h3>
              <TechBadges items={items} label={group} />
            </div>
          ))}
        </div>
        <SkillsCloud />
      </div>
    </Section>
  );
}
