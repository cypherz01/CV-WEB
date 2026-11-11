"use client"

import { useEffect, useRef } from "react"

import { cn } from "@/lib/utils"

const format = (n: number) => Math.round(n).toLocaleString("en-GB")
const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

/**
 * Magic UI NumberTicker, adapted so the final value is in the server HTML (no-JS readers, crawlers),
 * and counting with requestAnimationFrame instead of motion's spring:
 * - server / no JS: shows `value`
 * - after hydration, if off screen: resets to `startValue`, then counts up to `value` once in view
 * - if already on screen at load, or with reduced motion: stays on `value`
 * The whole thing is aria-hidden; pair it with the final value as screen-reader text.
 */
export function NumberTicker({
  value,
  startValue = 0,
  prefix = "",
  suffix = "",
  duration = 1200,
  className,
}: {
  value: number
  startValue?: number
  prefix?: string
  suffix?: string
  duration?: number
  className?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === "undefined") return
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return

    let first = true
    let frame = 0
    const observer = new IntersectionObserver(([entry]) => {
      if (first) {
        first = false
        if (entry.isIntersecting) observer.disconnect() // on screen at load: keep the final value
        else el.textContent = format(startValue)
        return
      }
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        el.textContent = format(startValue + (value - startValue) * easeOutCubic(t))
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value, startValue, duration])

  return (
    <span aria-hidden="true" data-number-ticker="" className={cn("tabular-nums", className)}>
      {prefix}
      <span ref={ref}>{format(value)}</span>
      {suffix}
    </span>
  )
}
