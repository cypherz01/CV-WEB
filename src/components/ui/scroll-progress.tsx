import { cn } from "@/lib/utils"

/**
 * Magic UI ScrollProgress, rewritten as a CSS scroll-driven animation (globals.css): no JS at all.
 * Browsers without `animation-timeline` simply don't show it. Decorative: aria-hidden, hidden in print.
 */
export function ScrollProgress({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      data-scroll-progress=""
      className={cn("fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent-brand print:hidden", className)}
    />
  )
}
