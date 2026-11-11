"use client"

import type { ComponentProps } from "react"

import { usePlayWhenVisible } from "@/hooks/use-play-when-visible"
import { cn } from "@/lib/utils"

/**
 * Magic UI ShimmerButton, adapted as a link (the hero CTA jumps to #contact):
 * - one infinite animation (a spinning conic glint) instead of two, paused while off screen
 * - background from --accent-brand, text from --background (AA on the accent in both themes)
 * - data-slot="button" so print CSS hides it like the other buttons
 */
export function ShimmerLink({ className, children, ...props }: ComponentProps<"a">) {
  const { ref, paused } = usePlayWhenVisible<HTMLAnchorElement>()

  return (
    <a
      ref={ref}
      data-slot="button"
      data-loop="shimmer"
      data-paused={paused || undefined}
      className={cn(
        "group relative z-0 inline-flex h-9 items-center justify-center gap-1.5 overflow-hidden rounded-lg bg-accent-brand px-3 text-sm font-medium whitespace-nowrap text-background transition-transform active:translate-y-px [&_svg]:size-4 [&_svg]:shrink-0",
        className
      )}
      {...props}
    >
      {/* the glint: a conic gradient spinning behind the backdrop, showing only at the edge */}
      <span aria-hidden="true" className="absolute inset-0 -z-20 overflow-hidden rounded-[inherit]">
        <span className="absolute top-1/2 left-1/2 aspect-square w-[150%] -translate-1/2 animate-spin [animation-duration:3s] [background:conic-gradient(from_0deg,transparent_0_300deg,color-mix(in_oklch,var(--background)_80%,transparent)_360deg)]" />
      </span>
      <span
        aria-hidden="true"
        data-shimmer-backdrop=""
        className="absolute inset-[1.5px] -z-10 rounded-[calc(var(--radius-lg)-1.5px)] bg-accent-brand transition-[filter] group-hover:brightness-110"
      />
      {children}
    </a>
  )
}
