"use client";

// Logos in order matching the reference — all circular
const LOGOS = [
  { src: "/screen7/logo-google.png",       alt: "Google",                    bg: "#fff"    },
  { src: "/screen7/logo-uwc.png",          alt: "UWC Sustainability",         bg: "#3ab5a4" },
  { src: "/screen7/logo-stanfordperu.png", alt: "Stanford Peru",              bg: "#5c1420" },
  { src: "/screen7/logo-image133.svg",     alt: "BreakthroughTech",           bg: "#0d1f2d" },
  { src: "/screen7/logo-undp.png",         alt: "UNDP",                       bg: "#fff"    },
  { src: "/screen7/logo-ai4all.png",       alt: "AI4ALL",                     bg: "#fff"    },
  { src: "/screen7/logo-scienceclubs.svg", alt: "Science Clubs International", bg: "#28b5c8" },
  { src: "/screen7/logo-breakthrough.png", alt: "BreakthroughTech",           bg: "transparent" },
  { src: "/screen7/logo-image134.svg",     alt: "CodePath",                   bg: "#fff"    },
];

// Triple for seamless infinite loop
const TRACK = [...LOGOS, ...LOGOS, ...LOGOS];

export default function SeventhScreen() {
  return (
    <section style={{ background: "#111111", overflow: "hidden" }}>
      <style>{`
        @keyframes logoScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.3334%); }
        }
        .s7-track {
          display: flex;
          align-items: center;
          gap: clamp(28px, 4vw, 60px);
          width: max-content;
          padding: clamp(32px, 5vw, 64px) clamp(28px, 4vw, 60px);
          animation: logoScroll 32s linear infinite;
          will-change: transform;
        }
        .s7-track:hover { animation-play-state: paused; }
        .s7-logo {
          flex-shrink: 0;
          width:  clamp(130px, 16vw, 220px);
          height: clamp(130px, 16vw, 220px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 6px 28px rgba(0,0,0,0.22);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .s7-logo:hover {
          transform: scale(1.08);
          box-shadow: 0 12px 40px rgba(0,0,0,0.38);
        }
        .s7-logo img {
          width: 85%;
          height: 85%;
          object-fit: contain;
          display: block;
        }
      `}</style>

      {/* ── Top Bauhaus strip ── */}
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0 }}>
        <img
          src="/screen7/bauhaus-top.svg"
          alt=""
          aria-hidden="true"
          style={{
            width: "100%",
            height: "clamp(90px, 13vw, 180px)",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
          }}
        />
      </div>

      {/* ── Cream band with logo carousel ── */}
      <div style={{ background: "#F5E6C0", position: "relative", overflow: "hidden" }}>

        {/* Fade edges */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(to right, #F5E6C0 clamp(20px,4vw,60px), transparent clamp(60px,10vw,140px), transparent calc(100% - clamp(60px,10vw,140px)), #F5E6C0 calc(100% - clamp(20px,4vw,60px)))",
        }} />

        <div style={{ overflow: "hidden" }}>
          <div className="s7-track">
            {TRACK.map((logo, i) => (
              <div key={i} className="s7-logo" style={{ background: logo.bg }} title={logo.alt}>
                <img src={logo.src} alt={logo.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Bauhaus strip ── */}
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0 }}>
        <img
          src="/screen7/bauhaus-bottom.svg"
          alt=""
          aria-hidden="true"
          style={{
            width: "100%",
            height: "clamp(90px, 13vw, 180px)",
            objectFit: "cover",
            objectPosition: "center bottom",
            display: "block",
          }}
        />
      </div>

      {/* ── Label ── */}
      <div style={{ textAlign: "center", padding: "clamp(16px,2.5vw,32px) 0" }}>
        <p style={{
          fontFamily: "monospace",
          fontSize: "clamp(9px, 0.9vw, 12px)",
          letterSpacing: "0.22em",
          color: "rgba(255,255,255,0.28)",
          textTransform: "uppercase",
          margin: 0,
        }}>
          Organizations I've worked with
        </p>
      </div>
    </section>
  );
}
