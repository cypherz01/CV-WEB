"use client"

import { useEffect, useRef } from "react"
import { animate } from "motion/react"

import { cn } from "@/lib/utils"

const format = (n: number) => Math.round(n).toLocaleString("en-GB")

/**
 * Magic UI NumberTicker, adapted so the final value is in the server HTML (no-JS readers, crawlers):
 * - server / no JS: shows `value`
 * - after hydration, if off screen: resets to `startValue`, then springs up to `value` once in view
 * - if already on screen at load: stays on `value` (no visible jump back to zero)
 * The whole thing is aria-hidden; pair it with the final value as screen-reader text.
 */
export function NumberTicker({
  value,
  startValue = 0,
  prefix = "",
  suffix = "",
  className,
}: {
  value: number
  startValue?: number
  prefix?: string
  suffix?: string
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return

    let first = true
    let stop: (() => void) | undefined
    const observer = new IntersectionObserver(([entry]) => {
      if (first && !entry.isIntersecting) {
        el.textContent = format(startValue)
      } else if (entry.isIntersecting && !first) {
        observer.disconnect()
        stop = animate(startValue, value, {
          type: "spring",
          damping: 60,
          stiffness: 100,
          onUpdate: (n) => (el.textContent = format(n)),
          onComplete: () => (el.textContent = format(value)),
        }).stop
      } else if (first) {
        observer.disconnect() // on screen at load: keep the final value
      }
      first = false
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      stop?.()
    }
  }, [value, startValue])

  return (
    <span aria-hidden="true" data-number-ticker="" className={cn("tabular-nums", className)}>
      {prefix}
      <span ref={ref}>{format(value)}</span>
      {suffix}
    </span>
  )
}
