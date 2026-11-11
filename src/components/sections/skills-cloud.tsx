"use client";

import { lazy, Suspense } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

const SkillsCloudCanvas = lazy(() => import("./skills-cloud-canvas"));

/**
 * Decorative 3D cloud of the tech in Skills. Only rendered on large screens (it is never in the
 * DOM on phones), and aria-hidden: the skill badges carry the content. The canvas and icon data
 * are a lazy chunk, so they are not part of the initial JS budget.
 */
export function SkillsCloud() {
  const wide = useMediaQuery("(min-width: 1024px)");
  if (!wide) return null;

  return (
    <div aria-hidden="true" data-icon-cloud="" className="size-72 shrink-0 print:hidden">
      <Suspense fallback={null}>
        <SkillsCloudCanvas />
      </Suspense>
    </div>
  );
}
