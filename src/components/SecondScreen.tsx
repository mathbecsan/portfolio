"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["design", "build", "program"];

function useReveal(ref: React.RefObject<HTMLElement | null>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

export default function SecondScreen() {
  const sectionRef = useRef<HTMLElement>(null);
  const visible = useReveal(sectionRef as React.RefObject<HTMLElement>);

  const [wordIdx, setWordIdx] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const t = setInterval(() => {
      setExiting(true);
      setTimeout(() => {
        setWordIdx(p => (p + 1) % WORDS.length);
        setExiting(false);
      }, 320);
    }, 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#F5E6C0",
        overflow: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
      }}
    >
      <style>{`
        @keyframes wordIn { from { transform:translateY(18px);opacity:0 } to { transform:translateY(0);opacity:1 } }
        @keyframes cardIn { from { opacity:0 } to { opacity:1 } }
      `}</style>

      {/* Corner decorations — anchored to section edges */}
      <img src="/second-screen/word-1.svg" aria-hidden alt=""
        style={{ position: "absolute", top: 0, left: 0, width: "clamp(80px, 12vw, 180px)", height: "auto", zIndex: 0 }} />
      <img src="/second-screen/word-4.svg" aria-hidden alt=""
        style={{ position: "absolute", top: 0, right: 0, height: "clamp(80px, 12vw, 160px)", width: "auto", zIndex: 0 }} />
      <img src="/second-screen/word-2.svg" aria-hidden alt=""
        style={{ position: "absolute", bottom: 0, left: 0, width: "clamp(120px, 20vw, 300px)", height: "auto", zIndex: 0 }} />
      <img src="/second-screen/word-3.svg" aria-hidden alt=""
        style={{ position: "absolute", bottom: 0, right: 0, width: "clamp(120px, 20vw, 300px)", height: "auto", zIndex: 0 }} />

      {/* Main text — centered, above decorations */}
      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        padding: "clamp(100px, 14vw, 180px) clamp(48px, 8vw, 140px)",
        animation: visible ? "cardIn 0.8s ease both" : "none",
      }}>
        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontWeight: 700,
          fontSize: "clamp(26px, 4.2vw, 64px)",
          lineHeight: 1.2,
          color: "#1a1a1a",
          margin: 0,
          maxWidth: "18ch",
        }}>
          I{" "}
          <span style={{
            display: "inline-block",
            opacity: exiting ? 0 : 1,
            transform: exiting ? "translateY(-10px)" : "translateY(0)",
            transition: "opacity 0.28s ease, transform 0.28s ease",
            animation: !exiting ? "wordIn 0.38s cubic-bezier(0.22,1,0.36,1) both" : "none",
            color: "#6B1A1A",
            fontStyle: "italic",
          }}>
            {WORDS[wordIdx]}
          </span>
          {" "}products with meticulous attention to detail to create accessible user experiences for social good
        </p>
      </div>
    </section>
  );
}
