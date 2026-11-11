"use client";

import { useEffect, useRef, useState } from "react";

/**
 * For elements with infinite CSS animations: returns a ref and `paused`, which is true until the
 * element is on screen and again once it leaves. Paused is the server default, so nothing loops
 * before hydration. Spread `{ "data-paused": paused || undefined }` on the element; globals.css
 * pauses every animation inside [data-paused]. Keeps the page to one running loop at a time.
 */
export function usePlayWhenVisible<T extends Element>() {
  const ref = useRef<T>(null);
  const [paused, setPaused] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setPaused(!entry.isIntersecting));
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, paused };
}
