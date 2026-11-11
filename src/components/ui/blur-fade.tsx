"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"

import { cn } from "@/lib/utils"

/**
 * Magic UI BlurFade, rewritten without motion so the server HTML is never hidden:
 * - server / no JS: "initial", fully visible (content is readable without JavaScript)
 * - after hydration: "hidden" only if the element is entirely off screen, else "shown"
 * - "hidden" -> "shown" once `threshold` of it is on screen, and only once
 * The look lives in globals.css ([data-blur-fade]), which also forces it visible in print.
 */
type State = "initial" | "hidden" | "shown"

export function BlurFade({
  children,
  className,
  threshold = 0.2,
}: {
  children: ReactNode
  className?: string
  threshold?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<State>("initial")

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return

    let first = true
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= threshold || (first && entry.isIntersecting)) {
          setState("shown")
          observer.disconnect()
        } else if (first) {
          setState("hidden")
        }
        first = false
      },
      { threshold: [0, threshold] }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return (
    <div ref={ref} data-blur-fade={state} className={cn(className)}>
      {children}
    </div>
  )
}
