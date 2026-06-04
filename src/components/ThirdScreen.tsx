"use client";

// Screen 3: About — built from new Figma assets
// Layout: Bauhaus top → [photo left | academic info right] → Bauhaus bottom

export default function ThirdScreen() {
  return (
    <section style={{ overflow: "hidden", background: "#F5E6C0" }}>

      {/* ── Top Bauhaus strip ── */}
      <div style={{
        height: "clamp(100px, 13vw, 170px)",
        backgroundImage: "url('/bauhaus-pattern.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }} />

      {/* ── Two-column layout ── */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        minHeight: "clamp(500px, 60vw, 800px)",
      }}>

        {/* LEFT — Profile photo */}
        <div style={{
          flex: "0 0 clamp(280px, 40%, 560px)",
          overflow: "hidden",
          background: "#F5E6C0",
        }}>
          <img
            src="/screen3/mathias-profile2.png"
            alt="Mathias Becerra"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 15%",
              display: "block",
            }}
          />
        </div>

        {/* RIGHT — Academic info */}
        <div style={{
          flex: "1 1 320px",
          padding: "clamp(32px, 5vw, 64px) clamp(24px, 4vw, 56px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "clamp(12px, 1.8vw, 24px)",
          position: "relative",
        }}>

          {/* Stanford S logo — top right */}
          <img src="/screen3/image-136.svg" alt="Stanford University"
            style={{
              position: "absolute", top: "clamp(16px,2.5vw,32px)", right: "clamp(16px,2.5vw,32px)",
              width: "clamp(60px,8vw,110px)", height: "auto",
            }} />

          {/* "I AM A SENIOR MAJORING IN" */}
          <img src="/screen3/senior-majoring.svg" alt="I am a senior majoring in"
            style={{ width: "clamp(200px, 50%, 480px)", height: "auto", display: "block" }} />

          {/* "SYMBOLIC SYSTEMS" badge */}
          <img src="/screen3/symbolic-systems.svg" alt="Symbolic Systems"
            style={{ width: "clamp(260px, 65%, 580px)", height: "auto", display: "block" }} />

          {/* HCI / HAI logos inline */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "clamp(13px,1.3vw,17px)", color: "#1a1a2e" }}>(HCI</span>
            <img src="/screen3/hci-logo.svg" alt="HCI"
              style={{ width: "clamp(22px,2.5vw,32px)", height: "auto" }} />
            <span style={{ fontFamily: "Georgia, serif", fontSize: "clamp(13px,1.3vw,17px)", color: "#1a1a2e" }}>/</span>
            <img src="/screen3/hai-logo.svg" alt="HAI"
              style={{ width: "clamp(22px,2.5vw,32px)", height: "auto" }} />
            <span style={{ fontFamily: "Georgia, serif", fontSize: "clamp(13px,1.3vw,17px)", color: "#1a1a2e" }}>HAI CONCENTRATION)</span>
          </div>

          {/* AT STANFORD UNIVERSITY */}
          <p style={{
            fontFamily: "monospace", fontWeight: 900,
            fontSize: "clamp(14px,1.6vw,20px)",
            color: "#E63329", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase",
          }}>AT STANFORD UNIVERSITY</p>

          {/* Description */}
          <p style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(12px,1.2vw,16px)",
            color: "#364153", margin: 0, lineHeight: 1.65, maxWidth: 480,
          }}>
            An interdisciplinary Bachelor of Science degree program designed to explore the relationship between the human mind and artificial systems.
          </p>

          {/* KEY PRINCIPLES badge */}
          <img src="/screen3/keyprinciples.svg" alt="Key Principles"
            style={{ width: "clamp(200px, 55%, 500px)", height: "auto", display: "block" }} />

          {/* Principles grid */}
          <img src="/screen3/principles.svg" alt="I follow and believe in"
            style={{ width: "clamp(260px, 70%, 620px)", height: "auto", display: "block" }} />
        </div>
      </div>

      {/* ── Bottom Bauhaus strip ── */}
      <div style={{
        height: "clamp(100px, 13vw, 170px)",
        backgroundImage: "url('/screen7/bauhaus-top.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        transform: "scaleY(-1)",
      }} />
    </section>
  );
}
