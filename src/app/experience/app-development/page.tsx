"use client";
import { use, useState, useRef, useEffect } from "react";

const SCREENS = [
  "/app-dev/screen1.svg",
  "/app-dev/screen2.svg",
  "/app-dev/screen3.svg",
  "/app-dev/screen4.svg",
  "/app-dev/screen5.svg",
  "/app-dev/screen6.svg",
];

const ACTIONS = [
  { label: "Case Study",      img: "/app-dev/case-study.svg",   active: false, href: "#" },
  { label: "Metrics of Impact", img: "/app-dev/metrics.svg",    active: true,  href: "/experience/app-development/metrics" },
  { label: "Try the Demo",    img: "/app-dev/try-demo.svg",     active: false, href: "#" },
  { label: "CS377U Award",    img: "/app-dev/award.svg",        active: false, href: "#" },
];

// ── Infinite Carousel ─────────────────────────────────────────────────────
function Carousel() {
  const [paused, setPaused] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  // Duplicate slides so the loop is seamless
  const slides = [...SCREENS, ...SCREENS];

  return (
    <div style={{ position: "relative", overflow: "hidden", padding: "40px 0 60px" }}>
      <style>{`
        @keyframes carousel-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .carousel-track {
          display: flex;
          gap: 28px;
          width: max-content;
          animation: carousel-scroll 28s linear infinite;
          will-change: transform;
        }
        .carousel-track.paused { animation-play-state: paused; }
        .carousel-slide {
          flex-shrink: 0;
          width: clamp(160px, 16vw, 220px);
          cursor: pointer;
          transition: transform 0.4s cubic-bezier(0.22,1,0.36,1), box-shadow 0.4s ease, z-index 0s;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          z-index: 1;
        }
        .carousel-slide:hover,
        .carousel-slide.hovered {
          transform: scale(1.55) translateY(-12px) !important;
          box-shadow: 0 32px 80px rgba(0,0,0,0.5);
          z-index: 10;
        }
        .carousel-slide img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 20px;
        }
      `}</style>

      <div
        ref={trackRef}
        className={`carousel-track${paused ? " paused" : ""}`}
        style={{ alignItems: "flex-end" }}
      >
        {slides.map((src, i) => (
          <div
            key={i}
            className={`carousel-slide${hoveredIdx === i ? " hovered" : ""}`}
            style={{
              height: i % 3 === 1 ? "clamp(320px,38vw,500px)" : i % 3 === 2 ? "clamp(260px,30vw,420px)" : "clamp(290px,34vw,460px)",
            }}
            onMouseEnter={() => { setPaused(true); setHoveredIdx(i); }}
            onMouseLeave={() => { setPaused(false); setHoveredIdx(null); }}
          >
            <img src={src} alt={`Speak.io screen ${(i % SCREENS.length) + 1}`} />
          </div>
        ))}
      </div>

      {/* Gradient edges */}
      <div style={{ position: "absolute", inset: 0, top: 0, left: 0, width: "10%", background: "linear-gradient(90deg, #F5F1E8, transparent)", pointerEvents: "none", zIndex: 5 }} />
      <div style={{ position: "absolute", inset: 0, top: 0, right: 0, left: "auto", width: "10%", background: "linear-gradient(-90deg, #F5F1E8, transparent)", pointerEvents: "none", zIndex: 5 }} />
    </div>
  );
}

// ── Action Button ─────────────────────────────────────────────────────────
function ActionButton({ img, label, active, href }: typeof ACTIONS[0]) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={active ? href : undefined}
      style={{
        display: "block", textDecoration: "none", cursor: active ? "pointer" : "default",
        flex: "1 1 220px", maxWidth: 340,
        transform: hovered && active ? "translateY(-6px)" : hovered ? "translateY(-3px)" : "none",
        transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease, filter 0.3s ease",
        boxShadow: hovered ? "0 16px 48px rgba(0,0,0,0.18)" : "none",
        borderRadius: 8, overflow: "hidden",
        filter: !active && hovered ? "brightness(0.85)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={img} alt={label} style={{ width: "100%", height: "auto", display: "block" }} />
      {/* "Coming soon" badge for inactive */}
      {!active && hovered && (
        <div style={{
          position: "absolute",
          inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(0,0,0,0.35)",
          borderRadius: 8,
        }}>
          <span style={{
            fontFamily: "monospace", fontWeight: 800, fontSize: 13,
            color: "#fff", letterSpacing: "0.12em", textTransform: "uppercase",
            background: "rgba(0,0,0,0.6)", padding: "6px 16px", borderRadius: 4,
          }}>Coming Soon</span>
        </div>
      )}
    </a>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function AppDevelopmentPage() {
  return (
    <main style={{ background: "#F5F1E8", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(245,241,232,0.92)", backdropFilter: "blur(8px)",
        borderBottom: "1.5px solid rgba(31,41,55,0.08)",
      }}>
        <a href="/experience" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/experience-screen1/mathbecsanbrandnewlogo.svg" alt="MATHBECSAN" style={{ height: 24 }} />
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#1F2937", opacity: 0.5, letterSpacing: "0.15em" }}>← Experience</span>
        </a>
        <img src="/app-dev/logo.svg" alt="Speak.io" style={{ height: 28, width: "auto" }} />
      </nav>

      {/* ── Top Bauhaus strip ── */}
      <div style={{ paddingTop: 58, lineHeight: 0, overflow: "hidden" }}>
        <img src="/app-dev/bauhaus-top.svg" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      {/* ── Section 1: YouTube Video ── */}
      <section style={{ background: "#F5F1E8", padding: "clamp(48px,6vw,80px) clamp(24px,6vw,80px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em", color: "rgba(31,41,55,0.4)", textTransform: "uppercase", margin: "0 0 16px" }}>
            App Development · Speak.io
          </p>
          <h1 style={{
            fontFamily: "monospace", fontWeight: 900, fontSize: "clamp(32px,5vw,64px)",
            color: "#1F2937", margin: "0 0 clamp(24px,3vw,40px)", lineHeight: 0.95,
            textTransform: "uppercase", letterSpacing: "-0.02em",
          }}>
            AI Language<br />Learning App
          </h1>

          {/* YouTube Short embed — autoplay, muted */}
          <div style={{
            position: "relative", borderRadius: 16, overflow: "hidden",
            maxWidth: 420, boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
          }}>
            <div style={{ position: "relative", paddingBottom: "177.78%", height: 0 }}>
              <iframe
                src="https://www.youtube.com/embed/i_Wo3F2ZhFY?autoplay=1&mute=1&loop=1&playlist=i_Wo3F2ZhFY&controls=0&modestbranding=1&playsinline=1"
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
                allow="autoplay; encrypted-media"
                allowFullScreen
                title="Speak.io demo"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Section 2: Carousel ── */}
      <section style={{ background: "#F5F1E8", paddingBottom: "clamp(24px,4vw,48px)" }}>
        <div style={{ padding: "0 clamp(24px,6vw,80px)", marginBottom: 24 }}>
          <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em", color: "rgba(31,41,55,0.4)", textTransform: "uppercase", margin: 0 }}>
            Product Screens
          </p>
        </div>
        <Carousel />
      </section>

      {/* ── Bauhaus divider ── */}
      <div style={{ lineHeight: 0, overflow: "hidden" }}>
        <img src="/app-dev/bauhaus-top.svg" alt="" style={{ width: "100%", height: "auto", display: "block", transform: "scaleY(-1)" }} />
      </div>

      {/* ── Section 3: Action Buttons ── */}
      <section style={{ background: "#F5F1E8", padding: "clamp(48px,6vw,80px) clamp(24px,6vw,80px)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em", color: "rgba(31,41,55,0.4)", textTransform: "uppercase", margin: "0 0 32px" }}>
            Explore
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(16px,2vw,24px)", position: "relative" }}>
            {ACTIONS.map(a => <ActionButton key={a.label} {...a} />)}
          </div>
        </div>
      </section>

      {/* ── Bottom Bauhaus strip ── */}
      <div style={{ lineHeight: 0, overflow: "hidden" }}>
        <img src="/app-dev/bauhaus-bottom.svg" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

    </main>
  );
}
