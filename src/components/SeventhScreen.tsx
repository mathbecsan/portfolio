"use client";

// Logo metadata — org name + path + size hint
const LOGOS = [
  { src: "/screen7/logo-google.png",       alt: "Google",                   bg: "#fff"     },
  { src: "/screen7/logo-uwc.png",          alt: "UWC Sustainability",        bg: "#3ab5a4"  },
  { src: "/screen7/logo-stanfordperu.png", alt: "Stanford Peru",             bg: "#5c0f1e"  },
  { src: "/screen7/logo-image133.svg",     alt: "Organization",              bg: "transparent" },
  { src: "/screen7/logo-undp.png",         alt: "UNDP",                      bg: "#fff"     },
  { src: "/screen7/logo-ai4all.png",       alt: "AI4ALL",                    bg: "#fff"     },
  { src: "/screen7/logo-scienceclubs.svg", alt: "Science Clubs International", bg: "transparent" },
  { src: "/screen7/logo-breakthrough.png", alt: "BreakthroughTech",          bg: "transparent" },
  { src: "/screen7/logo-image134.svg",     alt: "Organization 2",            bg: "transparent" },
];

export default function SeventhScreen() {
  // Duplicate for seamless infinite loop
  const track = [...LOGOS, ...LOGOS, ...LOGOS];

  return (
    <section style={{
      background: "#0d0d0d",
      overflow: "hidden",
      padding: "clamp(40px, 6vw, 80px) 0",
      position: "relative",
    }}>
      <style>{`
        @keyframes logoScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        .logo-track {
          display: flex;
          align-items: center;
          gap: clamp(24px, 4vw, 56px);
          width: max-content;
          animation: logoScroll 28s linear infinite;
        }
        .logo-track:hover {
          animation-play-state: paused;
        }
        .logo-item {
          flex-shrink: 0;
          width: clamp(80px, 10vw, 130px);
          height: clamp(80px, 10vw, 130px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          box-shadow: 0 4px 24px rgba(0,0,0,0.35);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: pointer;
        }
        .logo-item:hover {
          transform: scale(1.12);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        }
        .logo-item img {
          width: 80%;
          height: 80%;
          object-fit: contain;
        }
      `}</style>

      {/* Section label */}
      <div style={{
        textAlign: "center",
        marginBottom: "clamp(20px, 3vw, 40px)",
      }}>
        <p style={{
          fontFamily: "monospace",
          fontSize: "clamp(9px, 1vw, 12px)",
          letterSpacing: "0.22em",
          color: "rgba(255,255,255,0.3)",
          textTransform: "uppercase",
          margin: 0,
        }}>
          Organizations I've worked with
        </p>
      </div>

      {/* Fade masks on sides */}
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: "clamp(40px, 8vw, 120px)",
          background: "linear-gradient(to right, #0d0d0d, transparent)",
          zIndex: 2, pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", right: 0, top: 0, bottom: 0,
          width: "clamp(40px, 8vw, 120px)",
          background: "linear-gradient(to left, #0d0d0d, transparent)",
          zIndex: 2, pointerEvents: "none",
        }} />

        {/* Scrolling track */}
        <div style={{ overflow: "hidden", padding: "clamp(8px, 1.5vw, 20px) 0" }}>
          <div className="logo-track">
            {track.map((logo, i) => (
              <div
                key={i}
                className="logo-item"
                style={{ background: logo.bg }}
                title={logo.alt}
              >
                <img src={logo.src} alt={logo.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bauhaus accent card below */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "clamp(24px, 4vw, 48px)",
      }}>
        <img
          src="/screen7/bauhaus-card.svg"
          alt=""
          aria-hidden="true"
          style={{
            width: "clamp(160px, 22vw, 300px)",
            height: "auto",
            opacity: 0.85,
          }}
        />
      </div>
    </section>
  );
}
