"use client"

import { usePlayWhenVisible } from "@/hooks/use-play-when-visible"
import { cn } from "@/lib/utils"

/**
 * Magic UI BorderBeam, adapted: a CSS keyframe (animate-border-beam in globals.css) instead of motion,
 * coloured from --accent-brand, decorative (aria-hidden), and paused while off screen.
 * The parent needs `position: relative` and a border radius to inherit.
 */
export function BorderBeam({
  size = 80,
  borderWidth = 1.5,
  className,
}: {
  size?: number
  borderWidth?: number
  className?: string
}) {
  const { ref, paused } = usePlayWhenVisible<HTMLDivElement>()

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-border-beam=""
      data-loop="border-beam"
      data-paused={paused || undefined}
      className="pointer-events-none absolute inset-0 rounded-[inherit] border-(length:--border-beam-width) border-transparent mask-[linear-gradient(transparent,transparent),linear-gradient(#000,#000)] mask-intersect [mask-clip:padding-box,border-box] print:hidden"
      style={{ "--border-beam-width": `${borderWidth}px` } as React.CSSProperties}
    >
      <div
        className={cn(
          "animate-border-beam absolute aspect-square bg-linear-to-l from-accent-brand via-accent-brand/40 to-transparent",
          className
        )}
        style={{ width: size, offsetPath: `rect(0 auto auto 0 round ${size}px)` }}
      />
    </div>
  )
}
