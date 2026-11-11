"use client";

import { Briefcase, FolderGit2, House, Mail, Moon, Sun, User, Wrench, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { Dock, DockIcon } from "@/components/ui/dock";

const SECTIONS: [label: string, id: string, Icon: LucideIcon][] = [
  ["Home", "top", House],
  ["About", "about", User],
  ["Experience", "work", Briefcase],
  ["Skills", "skills", Wrench],
  ["Projects", "projects", FolderGit2],
  ["Contact", "contact", Mail],
];

const ICON_LINK =
  "group/item relative flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-5";

/**
 * CSS-only tooltip (no Radix/popper JS): shown while its item is hovered or keyboard-focused.
 * It repeats the item's aria-label, so the name and the tooltip never drift apart.
 */
function Tip({ label }: { label: string }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-full left-1/2 mb-2 hidden -translate-x-1/2 rounded-md bg-foreground px-3 py-1.5 text-xs whitespace-nowrap text-background group-hover/item:block group-focus-visible/item:block"
    >
      {label}
    </span>
  );
}

// GitHub mark from simple-icons (CC0), inlined: importing it would pull the icon-cloud data into the initial JS.
const GITHUB_PATH =
  "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={GITHUB_PATH} />
    </svg>
  );
}

export function SiteDock({ github }: { github?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <nav aria-label="Dock" className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 print:hidden">
      <Dock>
        {SECTIONS.map(([label, id, Icon]) => (
          <DockIcon key={id}>
            <a href={`#${id}`} aria-label={label} className={ICON_LINK}>
              <Icon aria-hidden="true" />
              <Tip label={label} />
            </a>
          </DockIcon>
        ))}
        {github && (
          <DockIcon>
            <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={ICON_LINK}>
              <GitHubIcon />
              <Tip label="GitHub" />
            </a>
          </DockIcon>
        )}
        <DockIcon>
          <button
            type="button"
            aria-label="Toggle theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className={ICON_LINK}
          >
            {/* Both icons render; CSS picks one, so server and client markup always match. */}
            <Sun aria-hidden="true" className="hidden dark:block" />
            <Moon aria-hidden="true" className="dark:hidden" />
            <Tip label="Toggle theme" />
          </button>
        </DockIcon>
      </Dock>
    </nav>
  );
}
