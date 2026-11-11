import { cn } from "@/lib/utils"

/**
 * Magic UI DotPattern, adapted: one SVG <pattern> tiled over the whole box instead of one
 * motion circle per dot, so it needs no JS, renders on the server and never animates.
 * Decorative: aria-hidden, hidden in print. Dots take the text colour; fade edges with a mask.
 */
export function DotPattern({
  id,
  spacing = 16,
  radius = 1,
  className,
}: {
  id: string
  spacing?: number
  radius?: number
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      data-dot-pattern=""
      className={cn("pointer-events-none absolute inset-0 h-full w-full print:hidden", className)}
    >
      <defs>
        <pattern id={id} width={spacing} height={spacing} patternUnits="userSpaceOnUse">
          <circle cx={radius} cy={radius} r={radius} fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  )
}
