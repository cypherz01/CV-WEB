"use client";

import {
  siApachekafka,
  siApachemaven,
  siConfluence,
  siDocker,
  siFastapi,
  siGit,
  siGithubactions,
  siJavascript,
  siJenkins,
  siJira,
  siJunit5,
  siOpenjdk,
  siPytest,
  siPython,
  siReact,
  siSpringboot,
  siUnity,
  siUnrealengine,
  type SimpleIcon,
} from "simple-icons";
import { IconCloud } from "@/components/ui/icon-cloud";
import { useMediaQuery } from "@/hooks/use-media-query";

const ICONS: SimpleIcon[] = [
  siPython, siOpenjdk, siSpringboot, siReact, siJavascript, siFastapi, siDocker, siApachekafka, siJenkins,
  siGit, siGithubactions, siPytest, siJunit5, siApachemaven, siJira, siConfluence, siUnity, siUnrealengine,
];

/** Near-black brand colours vanish on the dark theme, so they get the neutral muted grey instead. */
function iconColour(hex: string) {
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b < 60 ? "71717a" : hex;
}

/** Inline SVG data URIs: no request to any icon CDN. */
const IMAGES = ICONS.map(
  (icon) =>
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="-4 -4 32 32"><path fill="#${iconColour(icon.hex)}" d="${icon.path}"/></svg>`,
    ),
);

/**
 * Decorative 3D cloud of the tech in Skills. Only rendered on large screens (it is never in the
 * DOM on phones, saving the canvas work), and aria-hidden: the skill badges carry the content.
 */
export function SkillsCloud() {
  const wide = useMediaQuery("(min-width: 1024px)");
  if (!wide) return null;

  return (
    <div aria-hidden="true" data-icon-cloud="" className="size-72 shrink-0 print:hidden">
      <IconCloud images={IMAGES} />
    </div>
  );
}
