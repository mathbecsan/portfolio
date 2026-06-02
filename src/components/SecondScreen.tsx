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
        background: "#0d0d0d",
        padding: "clamp(32px, 6vw, 80px) clamp(24px, 6vw, 80px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        @keyframes wordIn { from { transform:translateY(18px);opacity:0 } to { transform:translateY(0);opacity:1 } }
        @keyframes cardIn { from { transform:translateY(48px);opacity:0 } to { transform:translateY(0);opacity:1 } }
      `}</style>

      {/* Card */}
      <div style={{
        position: "relative",
        width: "100%",
        maxWidth: 1100,
        background: "#F5E6C0",
        borderRadius: "clamp(12px, 2vw, 24px)",
        overflow: "hidden",
        animation: visible ? "cardIn 0.8s cubic-bezier(0.22,1,0.36,1) both" : "none",
      }}>

        {/* Top-left Bauhaus corner */}
        <img src="/second-screen/word-1.svg" aria-hidden alt=""
          style={{ position: "absolute", top: 0, left: 0, width: "clamp(80px, 14vw, 200px)", height: "auto" }} />

        {/* Top-right vertical stripe */}
        <img src="/second-screen/word-4.svg" aria-hidden alt=""
          style={{ position: "absolute", top: 0, right: 0, height: "clamp(80px, 14vw, 180px)", width: "auto" }} />

        {/* Bottom-left Bauhaus */}
        <img src="/second-screen/word-2.svg" aria-hidden alt=""
          style={{ position: "absolute", bottom: 0, left: 0, width: "clamp(120px, 22vw, 320px)", height: "auto" }} />

        {/* Bottom-right Bauhaus */}
        <img src="/second-screen/word-3.svg" aria-hidden alt=""
          style={{ position: "absolute", bottom: 0, right: 0, width: "clamp(120px, 22vw, 320px)", height: "auto" }} />

        {/* Main text */}
        <div style={{
          position: "relative",
          zIndex: 1,
          padding: "clamp(60px, 8vw, 110px) clamp(48px, 8vw, 120px)",
          textAlign: "left",
        }}>
          <p style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: "clamp(22px, 3.8vw, 58px)",
            lineHeight: 1.25,
            color: "#1a1a1a",
            margin: 0,
          }}>
            I{" "}
            {/* Cycling word */}
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
      </div>
    </section>
  );
}
