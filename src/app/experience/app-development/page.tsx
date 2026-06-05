"use client";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { useEffect, useRef, useState } from "react";

// Duplicated so Swiper v12 loop never runs out of content during wrap transitions
const SCREENS = [
  "/app-dev/screen1.svg",
  "/app-dev/screen2.svg",
  "/app-dev/screen3.svg",
  "/app-dev/screen4.svg",
  "/app-dev/screen5.svg",
  "/app-dev/screen1.svg",
  "/app-dev/screen2.svg",
  "/app-dev/screen3.svg",
  "/app-dev/screen4.svg",
  "/app-dev/screen5.svg",
];

const ACTIONS = [
  { label: "Metrics of Impact", img: "/app-dev/metrics.svg",    href: "/experience/app-development/metrics", active: true  },
  { label: "Case Study",        img: "/app-dev/case-study.svg", href: "#",                                    active: false },
  { label: "Try the Demo",      img: "/app-dev/try-demo.svg",   href: "#",                                    active: false },
  { label: "CS377U Award",      img: "/app-dev/award.svg",      href: "#",                                    active: false },
];

// ── Swiper Coverflow Carousel ─────────────────────────────────────────────
function SwiperCarousel() {
  const swiperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let sw: unknown;
    (async () => {
      const { Swiper } = await import("swiper");
      const { Autoplay, EffectCoverflow, Pagination } = await import("swiper/modules");
      // @ts-ignore
      sw = new Swiper(swiperRef.current, {
        modules: [Autoplay, EffectCoverflow, Pagination],
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        loop: true,
        loopAdditionalSlides: 5,
        loopAddBlankSlides: false,
        coverflowEffect: {
          rotate: 0,
          depth: 120,
          modifier: 2.5,
          slideShadows: true,
          stretch: 0,
        },
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        pagination: { el: ".swiper-pagination", clickable: true, dynamicBullets: true },
        spaceBetween: 24,
      });
    })();
    return () => { if (sw && (sw as any).destroy) (sw as any).destroy(); };
  }, []);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <style>{`
        .app-swiper { width: 100%; padding-bottom: 40px !important; overflow: visible !important; }
        .app-swiper .swiper-wrapper { align-items: center; }
        .app-swiper .swiper-slide {
          width: 200px !important;
          border-radius: 20px;
          overflow: hidden;
          filter: grayscale(70%) brightness(0.6);
          transition: filter 0.8s cubic-bezier(0.25,0.4,0.45,1.4),
                      transform 0.8s cubic-bezier(0.25,0.4,0.45,1.4);
          cursor: grab;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        }
        .app-swiper .swiper-slide-active {
          filter: grayscale(0%) brightness(1) !important;
        }
        .app-swiper .swiper-slide-active:hover {
          transform: scale(1.06) !important;
          transition: transform 0.3s ease !important;
          z-index: 10;
        }
        .app-swiper .swiper-slide img {
          width: 100%; height: auto; display: block; border-radius: 20px;
        }
        .app-swiper .swiper-pagination { bottom: 8px !important; }
        .app-swiper .swiper-pagination-bullet {
          width: 8px; height: 8px;
          background: #1F2937; opacity: 0.25;
          transition: opacity 0.3s, transform 0.3s;
        }
        .app-swiper .swiper-pagination-bullet-active {
          background: #E7000B; opacity: 1;
          transform: scale(1.3);
        }
      `}</style>

      <p style={{
        fontFamily: "monospace", fontSize: 10, letterSpacing: "0.2em",
        color: "rgba(31,41,55,0.4)", textTransform: "uppercase",
        margin: "0 0 14px", textAlign: "center",
      }}>
        Product Screens · Drag to explore
      </p>

      <div ref={swiperRef} className="swiper app-swiper">
        <div className="swiper-wrapper">
          {SCREENS.map((src, i) => (
            <div key={i} className="swiper-slide">
              <img src={src} alt={`Screen ${i + 1}`} draggable={false} />
            </div>
          ))}
        </div>
        <div className="swiper-pagination" />
      </div>
    </div>
  );
}

// ── Action Button ─────────────────────────────────────────────────────────
function ActionBtn({ img, label, href, active }: typeof ACTIONS[0]) {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={active ? href : undefined}
      style={{
        display: "block", textDecoration: "none", position: "relative",
        cursor: active ? "pointer" : "default",
        transform: hovered ? "translateY(-3px) scale(1.02)" : "none",
        transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
        boxShadow: hovered && active
          ? "0 14px 40px rgba(0,0,0,0.16)"
          : hovered ? "0 6px 20px rgba(0,0,0,0.10)" : "none",
        borderRadius: 10, overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={img} alt={label} style={{ width: "100%", height: "auto", display: "block" }} />
      {!active && hovered && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.38)",
          display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10,
        }}>
          <span style={{
            fontFamily: "monospace", fontWeight: 800, fontSize: 10, color: "#fff",
            letterSpacing: "0.12em", textTransform: "uppercase",
            background: "rgba(0,0,0,0.65)", padding: "4px 12px", borderRadius: 4,
          }}>
            Coming Soon
          </span>
        </div>
      )}
    </a>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function AppDevelopmentPage() {
  return (
    <main style={{ background: "#FFFFFF", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "10px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,255,255,0.95)", backdropFilter: "blur(8px)",
        borderBottom: "1.5px solid rgba(31,41,55,0.08)",
      }}>
        <a href="/experience" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/experience-screen1/mathbecsanbrandnewlogo.svg" alt="MATHBECSAN" style={{ height: 22 }} />
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "#1F2937", opacity: 0.5, letterSpacing: "0.15em" }}>← Experience</span>
        </a>
        <img src="/app-dev/logo.svg" alt="Speak.io" style={{ height: 24, width: "auto" }} />
      </nav>

      {/* ── Top Bauhaus strip ── */}
      <div style={{ paddingTop: 48, lineHeight: 0, overflow: "hidden" }}>
        <img src="/app-dev/bauhaus-top.svg" alt="" style={{ width: "100%", height: "clamp(40px,4.5vw,60px)", objectFit: "cover", objectPosition: "top", display: "block" }} />
      </div>

      {/* ══ MAIN LAYOUT: 3 columns ══════════════════════════════════════════ */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "0.7fr 1.6fr 0.9fr",
        gap: "clamp(12px,2vw,28px)",
        padding: "clamp(12px,2vw,20px) clamp(16px,3vw,40px)",
        minHeight: "calc(100vh - 128px)",
        alignItems: "center",
      }}>

        {/* ── COL 1: Logo + Video phone only ── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "flex-start", alignSelf: "center" }}>
          <img
            src="/app-dev/logo.svg"
            alt="Speak.io"
            style={{ width: "clamp(130px,14vw,200px)", height: "auto" }}
          />

          {/* Video — crop YouTube black bars by oversizing the iframe inside a clipped container */}
          <div style={{
            width: "clamp(140px,15vw,210px)",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            background: "#fff",
            alignSelf: "center",
          }}>
            {/* Aspect ratio box — portrait 9:16 */}
            <div style={{ position: "relative", paddingBottom: "177.78%", overflow: "hidden" }}>
              {/* Slight oversize to push YouTube's thin black letterbox bars off-edge */}
              <iframe
                src="https://www.youtube.com/embed/i_Wo3F2ZhFY?autoplay=1&mute=1&loop=1&playlist=i_Wo3F2ZhFY&controls=0&showinfo=0&modestbranding=1&playsinline=1&iv_load_policy=3&rel=0"
                style={{
                  position: "absolute",
                  top: "-3%", left: "-3%",
                  width: "106%", height: "106%",
                  border: "none",
                }}
                allow="autoplay; encrypted-media"
                title="Speak.io demo"
              />
            </div>
          </div>
        </div>

        {/* ── COL 2: Coverflow Carousel ──
            overflow:hidden on column clips horizontal bleed (Swiper coverflow side cards)
            padding gives 36px vertical breathing room so the scale(1.06) hover is never cut  */}
        <div style={{ position: "relative", zIndex: 1, overflow: "hidden", padding: "36px 0" }}>
          <SwiperCarousel />
        </div>

        {/* ── COL 3: Action Buttons ── */}
        <div style={{
          display: "flex", flexDirection: "column",
          gap: "clamp(8px,1vw,12px)",
          justifyContent: "center",
          alignSelf: "center",
          position: "relative", zIndex: 2,
        }}>
          {ACTIONS.map(a => <ActionBtn key={a.label} {...a} />)}
        </div>

      </div>

      {/* ── Bottom Bauhaus strip ── */}
      <div style={{ lineHeight: 0, overflow: "hidden" }}>
        <img src="/app-dev/bauhaus-bottom.svg" alt="" style={{ width: "100%", height: "clamp(40px,4.5vw,60px)", objectFit: "cover", objectPosition: "top", display: "block" }} />
      </div>

    </main>
  );
}
