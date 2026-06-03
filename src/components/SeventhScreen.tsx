"use client";

const LOGOS = [
  { src: "/screen7/logo-google.png",       alt: "Google",                     bg: "#fff",         url: "https://google.com"                      },
  { src: "/screen7/logo-uwc.png",          alt: "UWC Sustainability",          bg: "#3ab5a4",      url: "https://www.uwc.org"                     },
  { src: "/screen7/logo-stanfordperu.png", alt: "Stanford Peru",               bg: "#5c1420",      url: "https://stanfordperu.org"                },
  { src: "/screen7/logo-image133.svg",     alt: "BreakthroughTech",            bg: "#0d1f2d",      url: "https://breakthroughtech.org"            },
  { src: "/screen7/logo-undp.png",         alt: "UNDP",                        bg: "#fff",         url: "https://undp.org"                        },
  { src: "/screen7/logo-ai4all.png",       alt: "AI4ALL",                      bg: "#fff",         url: "https://ai-4-all.org"                    },
  { src: "/screen7/logo-scienceclubs.svg", alt: "Science Clubs International", bg: "#28b5c8",      url: "https://scienceclubsintl.org"            },
  { src: "/screen7/logo-breakthrough.png", alt: "BreakthroughTech",            bg: "transparent",  url: "https://breakthroughtech.org"            },
  { src: "/screen7/logo-image134.svg",     alt: "CodePath",                    bg: "#fff",         url: "https://codepath.org"                    },
];

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
        .s7-logo-link {
          flex-shrink: 0;
          display: block;
          width:  clamp(130px, 16vw, 220px);
          height: clamp(130px, 16vw, 220px);
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 6px 28px rgba(0,0,0,0.22);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
          text-decoration: none;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .s7-logo-link:hover {
          transform: scale(1.1);
          box-shadow: 0 14px 44px rgba(0,0,0,0.4);
        }
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
        <img src="/screen7/bauhaus-top.svg" alt="" aria-hidden="true"
          style={{ width: "100%", height: "clamp(90px, 13vw, 180px)", objectFit: "cover", objectPosition: "center top", display: "block" }} />
      </div>

      {/* ── Cream carousel band ── */}
      <div style={{ background: "#F5E6C0", position: "relative", overflow: "hidden" }}>
        {/* Side fade masks */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "linear-gradient(to right, #F5E6C0 3%, transparent 14%, transparent 86%, #F5E6C0 97%)",
        }} />
        <div style={{ overflow: "hidden" }}>
          <div className="s7-track">
            {TRACK.map((logo, i) => (
              <a key={i} className="s7-logo-link" href={logo.url}
                target="_blank" rel="noopener noreferrer"
                style={{ background: logo.bg }} title={logo.alt}>
                <img src={logo.src} alt={logo.alt} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ── Bottom Bauhaus strip — same asset flipped vertically ── */}
      <div style={{ lineHeight: 0 }}>
        <img src="/screen7/bauhaus-top.svg" alt="" aria-hidden="true"
          style={{
            width: "100%",
            height: "clamp(90px, 13vw, 180px)",
            objectFit: "cover",
            objectPosition: "center top",
            display: "block",
            transform: "scaleY(-1)",
          }} />
      </div>

      {/* ── Label ── */}
      <div style={{ textAlign: "center", padding: "clamp(12px, 2vw, 24px) 0" }}>
        <p style={{
          fontFamily: "monospace", fontSize: "clamp(9px, 0.9vw, 12px)",
          letterSpacing: "0.22em", color: "rgba(255,255,255,0.28)",
          textTransform: "uppercase", margin: 0,
        }}>
          Organizations I've worked with — click to visit
        </p>
      </div>
    </section>
  );
}
