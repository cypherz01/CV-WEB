import type { ComponentProps } from "react";

/** A link that opens in a new tab without giving the new page access to this one. */
export function ExternalLink({ children, ...props }: ComponentProps<"a"> & { href: string }) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
