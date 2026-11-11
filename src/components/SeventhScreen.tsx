"use client";
import { useEffect, useRef, type MouseEvent, type PointerEvent } from "react";

// Each entry is keyed by the artwork in `src`; `alt` and `url` must describe that same logo.
// `url: null` renders the logo without a link.
const LOGOS: { src: string; alt: string; bg: string; url: string | null }[] = [
  { src: "/screen7/logo-google.png",        alt: "Google",                      bg: "#fff",        url: "https://about.google" },
  { src: "/screen7/logo-uwc.png",           alt: "UWC",                         bg: "#3ab5a4",     url: "https://www.uwc.org" },
  { src: "/screen7/logo-stanfordperu.png",  alt: "Stanford Peru",               bg: "#5c1420",     url: "https://www.instagram.com/stanfordperu/" },
  { src: "/screen7/logo-image133.svg",      alt: "Science Clubs International", bg: "#0d1f2d",     url: "https://scienceclubs.org" },
  { src: "/screen7/logo-undp.png",          alt: "UNDP",                        bg: "#fff",        url: "https://www.undp.org" },
  { src: "/screen7/logo-ai4all.webp",       alt: "AI4ALL",                      bg: "#fff",        url: "https://ai-4-all.org" },
  { src: "/screen7/logo-scienceclubs.svg",  alt: "CodePath",                    bg: "#28b5c8",     url: "https://codepath.org" },
  { src: "/screen7/logo-breakthrough.png",  alt: "Break Through Tech",          bg: "transparent", url: "https://breakthroughtech.org" },
  { src: "/screen7/logo-image134.svg",      alt: "Aspire Leaders Program",       bg: "#fff",        url: "https://www.aspireleaders.org/program/aspire-leaders-program/" },
];

const TRACK = [...LOGOS, ...LOGOS, ...LOGOS];

const LOOP_SECONDS = 32;   // time for one full set to scroll past at cruising speed
const DRAG_THRESHOLD = 6;  // px of movement before a press counts as a drag (not a click)
const MAX_FLING = 4000;    // px/s cap on flick velocity

export default function SeventhScreen() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const s = useRef({
    offset: 0, velocity: 0, hovering: false, reduced: false,
    pointerId: -1, dragging: false, pressX: 0, lastX: 0, lastT: 0, moved: 0, dragVel: 0,
  });

  // Animation loop: cruise at a steady speed, ease back to it after a fling,
  // ease to a stop while hovered, and follow the pointer while dragging.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const st = s.current;
    try { st.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch {}

    let raf = 0;
    let prev = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - prev) / 1000, 0.05);
      prev = now;
      const setWidth = track.scrollWidth / 3;
      if (setWidth > 0) {
        if (!st.dragging) {
          const cruise = st.hovering || st.reduced ? 0 : setWidth / LOOP_SECONDS;
          st.velocity += (cruise - st.velocity) * (1 - Math.exp(-dt * 2.2));
          st.offset += st.velocity * dt;
        }
        st.offset = ((st.offset % setWidth) + setWidth) % setWidth;
        track.style.transform = `translate3d(${-st.offset}px,0,0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const st = s.current;
    st.pointerId = e.pointerId;
    st.pressX = st.lastX = e.clientX;
    st.lastT = performance.now();
    st.moved = 0;
    st.dragVel = 0;
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const st = s.current;
    if (e.pointerId !== st.pointerId) return;
    const now = performance.now();
    const dx = e.clientX - st.lastX;
    st.moved = Math.max(st.moved, Math.abs(e.clientX - st.pressX));
    if (!st.dragging && st.moved > DRAG_THRESHOLD) {
      st.dragging = true;
      st.velocity = 0;
      // Capture only once it's a real drag, so plain clicks still reach the links.
      try { viewportRef.current?.setPointerCapture(e.pointerId); } catch {}
      viewportRef.current?.classList.add("is-dragging");
    }
    if (st.dragging) {
      st.offset -= dx;
      const dt = Math.max((now - st.lastT) / 1000, 1 / 240);
      st.dragVel = st.dragVel * 0.75 + (-dx / dt) * 0.25;
    }
    st.lastX = e.clientX;
    st.lastT = now;
  };

  const endDrag = (e: PointerEvent<HTMLDivElement>) => {
    const st = s.current;
    if (e.pointerId !== st.pointerId) return;
    if (st.dragging) {
      // A flick carries momentum; holding still before release does not.
      const idle = performance.now() - st.lastT > 80;
      st.velocity = idle ? 0 : Math.max(-MAX_FLING, Math.min(MAX_FLING, st.dragVel));
      st.dragging = false;
      try { viewportRef.current?.releasePointerCapture(e.pointerId); } catch {}
      viewportRef.current?.classList.remove("is-dragging");
    }
    st.pointerId = -1;
  };

  // Swallow the click that ends a drag so it doesn't open a link.
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => {
    if (s.current.moved > DRAG_THRESHOLD) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section style={{ background: "#111111", overflow: "hidden" }}>
      <style>{`
        .s7-viewport {
          overflow: hidden;
          cursor: grab;
          touch-action: pan-y;
          user-select: none;
          -webkit-user-select: none;
        }
        .s7-viewport.is-dragging { cursor: grabbing; }
        .s7-track {
          display: flex;
          align-items: center;
          gap: clamp(28px, 4vw, 60px);
          width: max-content;
          padding: clamp(32px, 5vw, 64px) clamp(28px, 4vw, 60px);
          will-change: transform;
        }
        .s7-logo-link {
          flex-shrink: 0;
          width:  clamp(130px, 16vw, 220px);
          height: clamp(130px, 16vw, 220px);
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 6px 28px rgba(0,0,0,0.22);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
          -webkit-user-drag: none;
        }
        a.s7-logo-link { cursor: pointer; }
        .s7-viewport.is-dragging .s7-logo-link { cursor: grabbing; }
        .s7-logo-link:hover {
          transform: scale(1.1);
          box-shadow: 0 14px 44px rgba(0,0,0,0.4);
        }
        .s7-viewport.is-dragging .s7-logo-link:hover { transform: none; }
        .s7-logo-link img {
          width: 85%;
          height: 85%;
          object-fit: contain;
          display: block;
          pointer-events: none;
        }
      `}</style>

      {/* ── Top Bauhaus strip ── */}
      <div style={{ lineHeight: 0 }}>
        <img loading="lazy" decoding="async" src="/screen7/bauhaus-top.svg" alt="" aria-hidden="true"
          style={{ width: "100%", height: "clamp(90px, 13vw, 180px)", objectFit: "cover", objectPosition: "center top", display: "block" }} />
      </div>

      {/* ── Subtitle above logos ── */}
      <div style={{ background: "#F5E6C0", textAlign: "center", paddingTop: "clamp(18px, 3vw, 36px)", paddingBottom: 0 }}>
        <p style={{
          fontFamily: "var(--font-geist-sans), sans-serif", fontWeight: 700,
          fontSize: "clamp(11px, 1.1vw, 15px)",
          letterSpacing: "0.22em", color: "#4a3a1a",
          textTransform: "uppercase", margin: 0,
        }}>
          Organizations I&apos;ve worked with
        </p>
      </div>

      {/* ── Cream carousel band (drag or flick to scroll) ── */}
      <div style={{ background: "#F5E6C0", position: "relative", overflow: "hidden" }}>
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(to right, #F5E6C0 3%, transparent 14%, transparent 86%, #F5E6C0 97%)",
        }} />
        <div
          ref={viewportRef}
          className="s7-viewport"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onPointerEnter={() => { s.current.hovering = true; }}
          onPointerLeave={() => { s.current.hovering = false; }}
          onClickCapture={onClickCapture}
          onDragStart={(e) => e.preventDefault()}
        >
          <div ref={trackRef} className="s7-track">
            {TRACK.map((logo, i) => {
              const img = <img loading="lazy" decoding="async" src={logo.src} alt={logo.alt} draggable={false} />;
              return logo.url ? (
                <a key={i} className="s7-logo-link" href={logo.url} draggable={false}
                  target="_blank" rel="noopener noreferrer"
                  style={{ background: logo.bg }} title={logo.alt}>
                  {img}
                </a>
              ) : (
                <div key={i} className="s7-logo-link" style={{ background: logo.bg }} title={logo.alt}>
                  {img}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Bottom Bauhaus strip ── */}
      <div style={{ lineHeight: 0 }}>
        <img loading="lazy" decoding="async" src="/screen7/bauhaus-top.svg" alt="" aria-hidden="true"
          style={{ width: "100%", height: "clamp(90px, 13vw, 180px)", objectFit: "cover", objectPosition: "center top", display: "block", transform: "scaleY(-1)" }} />
      </div>
    </section>
  );
}
