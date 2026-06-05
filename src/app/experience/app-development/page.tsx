"use client";
import { useEffect, useRef, useState } from "react";

const SCREENS = [
  "/app-dev/screen1.svg",
  "/app-dev/screen2.svg",
  "/app-dev/screen3.svg",
  "/app-dev/screen4.svg",
  "/app-dev/screen5.svg",
  "/app-dev/screen6.svg",
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
      const { Autoplay, EffectCoverflow, Navigation, Pagination } = await import("swiper/modules");
      // @ts-ignore
      sw = new Swiper(swiperRef.current, {
        modules: [Autoplay, EffectCoverflow, Navigation, Pagination],
        effect: "coverflow",
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: "auto",
        loop: true,
        coverflowEffect: {
          rotate: 0,
          depth: 120,
          modifier: 2.5,
          slideShadows: true,
          stretch: 0,
        },
        autoplay: {
          delay: 2800,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
        pagination: { el: ".swiper-pagination", clickable: true },
      });
    })();
    return () => { if (sw && (sw as any).destroy) (sw as any).destroy(); };
  }, []);

  return (
    <div style={{ width: "100%", padding: "20px 0 40px", position: "relative" }}>
      <style>{`
        .app-swiper { width: 100%; padding-bottom: 48px !important; overflow: visible !important; }
        .app-swiper .swiper-slide {
          width: 200px !important;
          border-radius: 22px;
          overflow: hidden;
          filter: grayscale(75%) brightness(0.7);
          transition: filter 0.5s ease, transform 0.5s cubic-bezier(0.25,0.4,0.45,1.4);
          cursor: grab;
        }
        .app-swiper .swiper-slide-active {
          filter: grayscale(0%) brightness(1) !important;
        }
        .app-swiper .swiper-slide-active:hover {
          transform: scale(1.08) !important;
          transition: transform 0.3s ease !important;
        }
        .app-swiper .swiper-slide img { width: 100%; height: auto; display: block; border-radius: 22px; }
        .app-swiper .swiper-button-next,
        .app-swiper .swiper-button-prev {
          color: #E7000B;
          width: 36px; height: 36px;
          background: rgba(255,255,255,0.9);
          border-radius: 50%;
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
        }
        .app-swiper .swiper-button-next::after,
        .app-swiper .swiper-button-prev::after { font-size: 14px; font-weight: 900; }
        .app-swiper .swiper-pagination-bullet { background: #1F2937; opacity: 0.3; }
        .app-swiper .swiper-pagination-bullet-active { background: #E7000B; opacity: 1; }
      `}</style>

      <div ref={swiperRef} className="swiper app-swiper">
        <div className="swiper-wrapper">
          {SCREENS.map((src, i) => (
            <div key={i} className="swiper-slide">
              <img src={src} alt={`Screen ${i + 1}`} draggable={false} />
            </div>
          ))}
        </div>
        <div className="swiper-button-prev" />
        <div className="swiper-button-next" />
        <div className="swiper-pagination" />
      </div>
    </div>
  );
}

// ── Action Button ─────────────────────────────────────────────────────────
function ActionBtn({ img, label, href, active }: typeof ACTIONS[0]) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={active ? href : undefined}
      style={{ display: "block", textDecoration: "none", position: "relative",
        cursor: active ? "pointer" : "default",
        transform: hovered ? "translateY(-5px) scale(1.02)" : "none",
        transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), box-shadow 0.3s ease",
        boxShadow: hovered && active ? "0 16px 48px rgba(0,0,0,0.18)" : hovered ? "0 8px 24px rgba(0,0,0,0.1)" : "none",
        borderRadius: 10, overflow: "hidden",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <img src={img} alt={label} style={{ width: "100%", height: "auto", display: "block" }} />
      {!active && hovered && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 10,
        }}>
          <span style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 11, color: "#fff",
            letterSpacing: "0.12em", textTransform: "uppercase",
            background: "rgba(0,0,0,0.65)", padding: "5px 14px", borderRadius: 4 }}>
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
    <main style={{ background: "#F5F1E8", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "12px 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(245,241,232,0.95)", backdropFilter: "blur(8px)",
        borderBottom: "1.5px solid rgba(31,41,55,0.08)",
      }}>
        <a href="/experience" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/experience-screen1/mathbecsanbrandnewlogo.svg" alt="MATHBECSAN" style={{ height: 22 }} />
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "#1F2937", opacity: 0.5, letterSpacing: "0.15em" }}>← Experience</span>
        </a>
        <img src="/app-dev/logo.svg" alt="Speak.io" style={{ height: 26, width: "auto" }} />
      </nav>

      {/* ── Top Bauhaus strip ── */}
      <div style={{ paddingTop: 52, lineHeight: 0, overflow: "hidden" }}>
        <img src="/app-dev/bauhaus-top.svg" alt="" style={{ width: "100%", height: "clamp(50px,6vw,80px)", objectFit: "cover", objectPosition: "top", display: "block" }} />
      </div>

      {/* ══ HERO — everything in one view ══════════════════════════════════ */}
      <section style={{
        padding: "clamp(24px,4vw,48px) clamp(24px,5vw,64px)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(24px,4vw,48px)",
        alignItems: "center",
        minHeight: "calc(100vh - 180px)",
      }}>

        {/* LEFT — logo + video phone + second phone mockup */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(16px,2vw,28px)" }}>
          <img src="/app-dev/logo.svg" alt="Speak.io" style={{ width: "clamp(160px,20vw,260px)", height: "auto" }} />

          <div style={{ display: "flex", gap: "clamp(12px,2vw,24px)", alignItems: "flex-end" }}>

            {/* YouTube Short — cropped to phone only */}
            <div style={{
              position: "relative",
              width: "clamp(130px,14vw,190px)",
              borderRadius: 28,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              background: "#000",
              flexShrink: 0,
            }}>
              {/* Clip iframe to show only video, hide player chrome */}
              <div style={{ position: "relative", paddingBottom: "216.67%", overflow: "hidden" }}>
                {/* Cover bottom YouTube watermark */}
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "12%", background: "#000", zIndex: 2 }} />
                {/* Cover top YouTube UI */}
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "8%", background: "#000", zIndex: 2 }} />
                <iframe
                  src="https://www.youtube.com/embed/i_Wo3F2ZhFY?autoplay=1&mute=1&loop=1&playlist=i_Wo3F2ZhFY&controls=0&showinfo=0&modestbranding=1&playsinline=1&iv_load_policy=3&rel=0&disablekb=1"
                  style={{
                    position: "absolute",
                    top: "-12%",
                    left: "-3%",
                    width: "106%",
                    height: "124%",
                    border: "none",
                    pointerEvents: "none",
                  }}
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Speak.io demo"
                />
              </div>
            </div>

            {/* Second phone — app screen mockup */}
            <div style={{
              flex: 1,
              borderRadius: 24,
              overflow: "hidden",
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              transform: "translateY(-20px)",
            }}>
              <img src="/app-dev/screen3.svg" alt="Speak.io screen" style={{ width: "100%", height: "auto", display: "block" }} />
            </div>

          </div>
        </div>

        {/* RIGHT — action buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(12px,1.5vw,20px)" }}>
          {ACTIONS.map(a => <ActionBtn key={a.label} {...a} />)}
        </div>

      </section>

      {/* ── Bauhaus divider ── */}
      <div style={{ lineHeight: 0, overflow: "hidden" }}>
        <img src="/app-dev/bauhaus-top.svg" alt="" style={{ width: "100%", height: "clamp(50px,6vw,80px)", objectFit: "cover", objectPosition: "top", display: "block", transform: "scaleY(-1)" }} />
      </div>

      {/* ── Coverflow Carousel ── */}
      <section style={{ background: "#F5F1E8", paddingBottom: "clamp(32px,4vw,56px)" }}>
        <div style={{ padding: "clamp(24px,3vw,40px) 0 0", textAlign: "center" }}>
          <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.22em", color: "rgba(31,41,55,0.4)", textTransform: "uppercase", margin: "0 0 4px" }}>
            Product Screens
          </p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(12px,1.1vw,15px)", color: "rgba(31,41,55,0.5)", margin: 0 }}>
            Drag or hover to explore
          </p>
        </div>
        <SwiperCarousel />
      </section>

      {/* ── Bottom Bauhaus strip ── */}
      <div style={{ lineHeight: 0, overflow: "hidden" }}>
        <img src="/app-dev/bauhaus-bottom.svg" alt="" style={{ width: "100%", height: "clamp(50px,6vw,80px)", objectFit: "cover", objectPosition: "top", display: "block" }} />
      </div>

    </main>
  );
}
