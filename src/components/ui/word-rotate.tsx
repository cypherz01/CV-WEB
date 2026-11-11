"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

/**
 * Magic UI WordRotate, adapted:
 * - renders a <span>, so the hero keeps its only <h1> for the name
 * - the first word is server-rendered with no entry animation, so the HTML never hides it
 * - a CSS entry animation (tw-animate-css) replaces motion's AnimatePresence: the word swaps
 *   exactly when the interval fires, which keeps it predictable under a test clock
 */
export function WordRotate({
  words,
  duration = 2500,
  className,
}: {
  words: string[]
  duration?: number
  className?: string
}) {
  const [index, setIndex] = useState(0)
  const [rotated, setRotated] = useState(false)

  useEffect(() => {
    if (words.length < 2) return
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % words.length)
      setRotated(true)
    }, duration)
    return () => clearInterval(interval)
  }, [words, duration])

  return (
    <span className="inline-flex overflow-hidden">
      <span
        key={words[index]}
        data-word-rotate=""
        className={cn(rotated && "animate-in fade-in slide-in-from-top-4 duration-300 ease-out", className)}
      >
        {words[index]}
      </span>
    </span>
  )
}
