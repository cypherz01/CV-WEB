"use client";

import { Briefcase, FolderGit2, House, Mail, Moon, Sun, User, Wrench, type LucideIcon } from "lucide-react";
import { useTheme } from "next-themes";
import type { ReactNode } from "react";
import { siGithub } from "simple-icons";
import { Dock, DockIcon } from "@/components/ui/dock";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const SECTIONS: [label: string, id: string, Icon: LucideIcon][] = [
  ["Home", "top", House],
  ["About", "about", User],
  ["Experience", "work", Briefcase],
  ["Skills", "skills", Wrench],
  ["Projects", "projects", FolderGit2],
  ["Contact", "contact", Mail],
];

const ICON_LINK =
  "flex items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground [&_svg]:size-5";

/** One dock item: the label is both the accessible name and the tooltip, so they never drift apart. */
function DockItem({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        {label}
      </TooltipContent>
    </Tooltip>
  );
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={siGithub.path} />
    </svg>
  );
}

export function SiteDock({ github }: { github?: string }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <TooltipProvider>
      <nav aria-label="Dock" className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2 print:hidden">
        <Dock iconSize={40} iconMagnification={56} iconDistance={120}>
          {SECTIONS.map(([label, id, Icon]) => (
            <DockIcon key={id}>
              <DockItem label={label}>
                <a href={`#${id}`} aria-label={label} className={ICON_LINK}>
                  <Icon aria-hidden="true" />
                </a>
              </DockItem>
            </DockIcon>
          ))}
          {github && (
            <DockIcon>
              <DockItem label="GitHub">
                <a href={github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className={ICON_LINK}>
                  <GitHubIcon />
                </a>
              </DockItem>
            </DockIcon>
          )}
          <DockIcon>
            <DockItem label="Toggle theme">
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className={ICON_LINK}
              >
                {/* Both icons render; CSS picks one, so server and client markup always match. */}
                <Sun aria-hidden="true" className="hidden dark:block" />
                <Moon aria-hidden="true" className="dark:hidden" />
              </button>
            </DockItem>
          </DockIcon>
        </Dock>
      </nav>
    </TooltipProvider>
  );
}
