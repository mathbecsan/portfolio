"use client";

import { useEffect, useRef, useState } from "react";
import IntroAnimation from "@/components/IntroAnimation";

type Stage = "preloader" | "intro" | "home";

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

const DURATION = 2600;

export default function Home() {
  const [stage, setStage] = useState<Stage>("preloader");
  const [percent, setPercent] = useState(0);
  const [wipePhase, setWipePhase] = useState<"idle" | "in" | "out">("idle");
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (stage !== "preloader") return;

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
          requestAnimationFrame(() => {
            setWipePhase("in");
            setTimeout(() => setWipePhase("out"), 650);
            setTimeout(() => setStage("intro"), 1300);
          });
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }, 300);

    return () => {
      clearTimeout(delay);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [stage]);

  const wipeInActive = wipePhase === "in" || wipePhase === "out";
  const wipeOutActive = wipePhase === "out";

  return (
    <>
      {/* ── Layer 0: Home screen ─────────────────────────── */}
      <main
        className="min-h-screen flex flex-col items-center justify-center transition-opacity duration-700"
        style={{
          opacity: stage === "home" ? 1 : 0,
          pointerEvents: stage === "home" ? "auto" : "none",
        }}
      >
        <h1 className="text-[clamp(40px,8vw,96px)] font-bold tracking-tight leading-none">
          mathias becerra
        </h1>
        <p className="text-[13px] tracking-[0.2em] uppercase text-[#f0ede6]/40 mt-6">
          software engineer · san francisco
        </p>
      </main>

      {/* ── Layer 1: Logo intro animation ────────────────── */}
      {stage === "intro" && (
        <IntroAnimation onComplete={() => setStage("home")} />
      )}

      {/* ── Layer 2: Preloader ───────────────────────────── */}
      {stage === "preloader" && (
        <div className="fixed inset-0 overflow-hidden select-none cursor-default" style={{ zIndex: 50 }}>
          <div className="absolute inset-0 bg-[#0d0d0d]" />

          {/* wipe panel */}
          <div
            className="absolute inset-0 bg-[#f0ede6]"
            style={{
              zIndex: 1,
              transformOrigin: wipeOutActive ? "right center" : "left center",
              transform:
                wipeInActive && !wipeOutActive ? "scaleX(1)"
                : wipeOutActive ? "scaleX(0)"
                : "scaleX(0)",
              transition: wipeInActive
                ? "transform 0.65s cubic-bezier(0.76,0,0.24,1)"
                : "none",
            }}
          />

          {/* counter */}
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ zIndex: 2 }}>
            <div
              className="font-bold text-[#f0ede6] leading-none tracking-[-0.04em] tabular-nums transition-opacity duration-200"
              style={{
                fontSize: "clamp(80px, 20vw, 180px)",
                opacity: wipeInActive ? 0 : 1,
              }}
            >
              {percent}%
            </div>
            <div
              className="text-[11px] tracking-[0.2em] uppercase text-[#f0ede6]/35 mt-5 transition-opacity duration-200"
              style={{ opacity: wipeInActive ? 0 : 1 }}
            >
              loading
            </div>
          </div>

          {/* progress bar */}
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#f0ede6]/10" style={{ zIndex: 3 }}>
            <div className="h-full bg-[#f0ede6]" style={{ width: `${percent}%`, transition: "none" }} />
          </div>
        </div>
      )}
    </>
  );
}
