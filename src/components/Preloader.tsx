"use client";

import { useEffect, useRef, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [percent, setPercent] = useState(0);
  const [phase, setPhase] = useState<"counting" | "wipe-in" | "reveal" | "wipe-out" | "done">("counting");
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const DURATION = 2600;

  function easeInOutCubic(t: number) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  useEffect(() => {
    const delay = setTimeout(() => {
      function tick(now: number) {
        if (!startRef.current) startRef.current = now;
        const raw = Math.min((now - startRef.current) / DURATION, 1);
        const t = easeInOutCubic(raw);
        setPercent(Math.round(t * 100));

        if (raw < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setPercent(100);
          setTimeout(() => setPhase("wipe-in"), 200);
          setTimeout(() => setPhase("wipe-out"), 900);
          setTimeout(() => {
            setPhase("done");
            onComplete();
          }, 1500);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }, 300);

    return () => {
      clearTimeout(delay);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [onComplete]);

  if (phase === "done") return null;

  const wipeInActive = phase === "wipe-in" || phase === "wipe-out";
  const wipeOutActive = phase === "wipe-out";

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0d0d] overflow-hidden select-none cursor-default">
      {/* Wipe panel */}
      <div
        className="absolute inset-0 bg-[#f0ede6] z-[1]"
        style={{
          transformOrigin: wipeOutActive ? "right center" : "left center",
          transform: wipeInActive && !wipeOutActive
            ? "scaleX(1)"
            : wipeOutActive
            ? "scaleX(0)"
            : "scaleX(0)",
          transition: wipeInActive
            ? "transform 0.65s cubic-bezier(0.76,0,0.24,1)"
            : "none",
        }}
      />

      {/* Counter + label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-[2]">
        <div
          className="font-bold text-[#f0ede6] leading-none tracking-[-0.04em] tabular-nums"
          style={{ fontSize: "clamp(80px, 20vw, 180px)" }}
        >
          {percent}%
        </div>
        <div className="text-[11px] tracking-[0.2em] uppercase text-[#f0ede6]/35 mt-5">
          loading
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f0ede6]/10 z-[3]">
        <div
          className="h-full bg-[#f0ede6]"
          style={{ width: `${percent}%`, transition: "none" }}
        />
      </div>
    </div>
  );
}
