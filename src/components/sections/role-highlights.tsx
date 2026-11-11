"use client";

import { ChevronDown } from "lucide-react";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * A disclosure for a role's bullets. The list is always rendered and only toggled with `hidden`,
 * so the text is in the static HTML for no-JS readers and crawlers, and print CSS can reveal it.
 */
export function RoleHighlights({ company, highlights }: { company: string; highlights: string[] }) {
  const [open, setOpen] = useState(false);
  const listId = useId();

  return (
    <div className="mt-2">
      <Button
        variant="ghost"
        size="sm"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((o) => !o)}
        className="-ml-2.5 text-muted-foreground"
      >
        Key achievements<span className="sr-only"> at {company}</span>
        <ChevronDown aria-hidden="true" className={open ? "rotate-180 transition-transform" : "transition-transform"} />
      </Button>
      <ul id={listId} hidden={!open} data-print-show className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed">
        {highlights.map((h) => (
          <li key={h}>{h}</li>
        ))}
      </ul>
    </div>
  );
}
