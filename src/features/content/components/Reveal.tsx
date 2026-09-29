"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
};

/**
 * One deliberate scroll reveal, used only for the first content moment
 * after the fold (the home paths tiles). Content is visible by default:
 * the hidden state applies only when IntersectionObserver is available,
 * the element is below the fold, and motion is not reduced. Without JS the
 * tiles simply render.
 */
export function Reveal({
  children,
  className = "",
  delayMs = 0,
}: RevealProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const bounds = element.getBoundingClientRect();
    if (bounds.top < window.innerHeight && bounds.bottom > 0) return;

    setEnabled(true);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
    );
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const visible = !enabled || shown;

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 0.5s ease ${delayMs}ms, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? "none" : "translateY(16px)",
      }}
    >
      {children}
    </div>
  );
}