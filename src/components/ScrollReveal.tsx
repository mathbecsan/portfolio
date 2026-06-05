"use client";
import { useEffect, useRef, ReactNode, CSSProperties } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  from?: "bottom" | "left" | "right" | "scale";
  delay?: number;
  threshold?: number;
  stagger?: boolean;
  fast?: boolean;
}

export default function ScrollReveal({
  children, className = "", style, from = "bottom",
  delay = 0, threshold = 0.1, stagger = false, fast = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("sr-hidden");
    if (from === "left")  el.classList.add("sr-from-left");
    if (from === "right") el.classList.add("sr-from-right");
    if (from === "scale") el.classList.add("sr-scale");
    if (stagger) el.classList.add("sr-stagger");
    if (fast)    el.classList.add("sr-fast");
    if (delay)   el.style.transitionDelay = `${delay}ms`;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("sr-visible");
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [from, delay, threshold, stagger, fast]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
