"use client";

import { useEffect, useRef, useState } from "react";

const WORDS = ["design", "build", "program"];

function useReveal(ref: React.RefObject<HTMLElement | null>, threshold = 0.1) {
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
      setTimeout(() => { setWordIdx(p => (p + 1) % WORDS.length); setExiting(false); }, 300);
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
        /* no margin/padding on section — let content handle spacing */
      }}
    >
      <style>{`
        @keyframes wordIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Corner / edge decorations ── */}
      {/* Top-left */}
      <img src="/second-screen/word-1.svg" aria-hidden alt=""
        style={{ position:"absolute", top:0, left:0, width:"clamp(70px,11vw,170px)", height:"auto", zIndex:0, display:"block" }} />
      {/* Top-right stripe */}
      <img src="/second-screen/word-4.svg" aria-hidden alt=""
        style={{ position:"absolute", top:0, right:0, height:"clamp(70px,11vw,160px)", width:"auto", zIndex:0, display:"block" }} />
      {/* Bottom-left */}
      <img src="/second-screen/word-2.svg" aria-hidden alt=""
        style={{ position:"absolute", bottom:0, left:0, width:"clamp(110px,18vw,280px)", height:"auto", zIndex:0, display:"block" }} />
      {/* Bottom-right */}
      <img src="/second-screen/word-3.svg" aria-hidden alt=""
        style={{ position:"absolute", bottom:0, right:0, width:"clamp(110px,18vw,280px)", height:"auto", zIndex:0, display:"block" }} />

      {/* ── Main text ── */}
      <div style={{
        position: "relative",
        zIndex: 1,
        width: "100%",
        padding: "clamp(80px,12vw,160px) clamp(40px,8vw,130px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>
        <p style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
          fontWeight: 700,
          fontSize: "clamp(28px, 4.5vw, 68px)",
          lineHeight: 1.2,
          color: "#1a1a1a",
          margin: 0,
          maxWidth: "16ch",
        }}>
          {"I "}
          <span key={wordIdx} style={{
            display: "inline-block",
            color: "#6B1A1A",
            fontStyle: "italic",
            opacity: exiting ? 0 : 1,
            transform: exiting ? "translateY(-10px)" : "translateY(0)",
            transition: "opacity 0.26s ease, transform 0.26s ease",
            animation: !exiting ? "wordIn 0.36s cubic-bezier(0.22,1,0.36,1) both" : "none",
          }}>
            {WORDS[wordIdx]}
          </span>
          {" products with meticulous attention to detail to create accessible user experiences for social good"}
        </p>
      </div>
    </section>
  );
}
