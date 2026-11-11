import type { ReactNode } from "react";
import { BlurFade } from "@/components/ui/blur-fade";

/** A page section: an anchor id for in-page links, and an h2 that names the region. */
export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className="scroll-mt-8 py-8 print:py-3">
      <BlurFade>
        <h2 id={headingId} className="mb-5 text-2xl print:mb-3 font-semibold tracking-tight">
          {title}
        </h2>
        {children}
      </BlurFade>
    </section>
  );
}
