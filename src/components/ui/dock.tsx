"use client"

import { useRef, type PointerEvent, type ReactNode } from "react"

import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

/**
 * Magic UI Dock, rewritten without motion (it was most of the page's JS):
 * - magnification sets each icon's size from the pointer's distance; a CSS transition smooths it
 * - off for touch screens ((hover: none) or (pointer: coarse)), where a tap would leave an icon stuck big
 * - icons have no padding or wrapper, so the child link/button fills the whole (>= 40 px) tap target
 * - with reduced motion the sizes still change but without the transition (globals.css)
 */
export function Dock({
  children,
  className,
  iconSize = 40,
  iconMagnification = 56,
  iconDistance = 120,
}: {
  children: ReactNode
  className?: string
  iconSize?: number
  iconMagnification?: number
  iconDistance?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const isTouch = useMediaQuery("(hover: none), (pointer: coarse)", true)

  const icons = () => [...(ref.current?.querySelectorAll<HTMLElement>("[data-dock-icon]") ?? [])]
  const setSize = (el: HTMLElement, px: number) => {
    el.style.width = `${px}px`
    el.style.height = `${px}px`
  }

  const magnify = (e: PointerEvent) => {
    if (isTouch || e.pointerType !== "mouse") return
    for (const el of icons()) {
      const { x, width } = el.getBoundingClientRect()
      const distance = Math.abs(e.clientX - (x + width / 2))
      const t = Math.max(0, 1 - distance / iconDistance)
      setSize(el, iconSize + (iconMagnification - iconSize) * t)
    }
  }
  const reset = () => icons().forEach((el) => setSize(el, iconSize))

  return (
    <div
      ref={ref}
      onPointerMove={magnify}
      onPointerLeave={reset}
      style={{ "--dock-icon-size": `${iconSize}px` } as React.CSSProperties}
      className={cn(
        "flex w-max items-end justify-center gap-1 rounded-2xl border bg-background/80 p-1.5 backdrop-blur-md sm:gap-2",
        className
      )}
    >
      {children}
    </div>
  )
}

export function DockIcon({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      data-dock-icon=""
      className={cn(
        "relative flex size-(--dock-icon-size) shrink-0 items-center justify-center rounded-full transition-[width,height] duration-150 ease-out *:size-full",
        className
      )}
    >
      {children}
    </div>
  )
}
