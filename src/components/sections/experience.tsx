import type { Resume } from "@/data/types";
import { formatDateRange, sortRolesNewestFirst } from "@/lib/cv";
import { RoleHighlights } from "./role-highlights";
import { Section } from "./section";
import { TechBadges } from "./tech-badges";

export function Experience({ cv }: { cv: Resume }) {
  return (
    <Section id="work" title="Experience">
      <ol className="flex flex-col gap-6">
        {sortRolesNewestFirst(cv.work).map((role) => (
          <li key={`${role.company}-${role.title}-${role.start}`} className="border-l-2 pl-4">
            <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
              <h3 className="font-semibold">{role.title}</h3>
              <p className="shrink-0 text-sm text-muted-foreground tabular-nums">{formatDateRange(role)}</p>
            </div>
            <p className="text-sm text-muted-foreground">{role.company}</p>
            <RoleHighlights company={role.company} highlights={role.highlights} />
            {role.tech && (
              <div className="mt-3">
                <TechBadges items={role.tech} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
