import { Mail } from "lucide-react";
import type { Resume } from "@/data/types";
import { ExternalLink } from "./external-link";
import { Section } from "./section";

export function Contact({ cv }: { cv: Resume }) {
  const profiles = [
    { label: "GitHub", href: cv.contact.github },
    { label: "LinkedIn", href: cv.contact.linkedin },
  ].filter((p): p is { label: string; href: string } => Boolean(p.href));

  return (
    <Section id="contact" title="Contact">
      <p className="mb-4 max-w-prose">{cv.availability}</p>
      <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
        <li>
          <a href={`mailto:${cv.contact.email}`} className="link inline-flex items-center gap-2 font-medium">
            <Mail aria-hidden="true" className="size-4" />
            {cv.contact.email}
          </a>
        </li>
        {profiles.map((p) => (
          <li key={p.label}>
            <ExternalLink href={p.href} className="link font-medium">
              {p.label}
            </ExternalLink>
          </li>
        ))}
      </ul>
    </Section>
  );
}
