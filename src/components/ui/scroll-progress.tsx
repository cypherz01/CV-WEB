"use client"

import { motion, useScroll } from "motion/react"

import { cn } from "@/lib/utils"

/** Magic UI ScrollProgress, adapted: brand accent colour, decorative (aria-hidden), hidden in print. */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll()

  return (
    <motion.div
      aria-hidden="true"
      data-scroll-progress=""
      className={cn("fixed inset-x-0 top-0 z-50 h-0.5 origin-left bg-accent-brand print:hidden", className)}
      style={{ scaleX: scrollYProgress }}
    />
  )
}
