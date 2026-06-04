"use client";

export default function ThirdScreen() {
  return (
    <section style={{ overflow: "hidden", background: "#F5E6C0" }}>

      {/* Top Bauhaus strip */}
      <div style={{
        height: "clamp(90px, 12vw, 155px)",
        backgroundImage: "url('/bauhaus-pattern.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }} />

      {/* Main row: centered, max-width container */}
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "stretch" }}>

        {/* Photo — 38% wide, fills full height */}
        <div style={{ flex: "0 0 38%", overflow: "hidden" }}>
          <img
            src="/screen3/mathias-profile2.png"
            alt="Mathias Becerra"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 10%", display: "block" }}
          />
        </div>

        {/* Content — 62% wide */}
        <div style={{
          flex: "1 1 0",
          padding: "clamp(24px, 3.5vw, 48px) clamp(28px, 4vw, 60px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "clamp(8px, 1.2vw, 14px)",
          position: "relative",
        }}>

          {/* Stanford S — top right */}
          <img src="/screen3/image-136.svg" alt="Stanford"
            style={{ position: "absolute", top: "clamp(12px,2vw,24px)", right: "clamp(12px,2vw,24px)", width: "clamp(56px,7vw,96px)", height: "auto" }} />

          {/* "I AM A SENIOR MAJORING IN" */}
          <img src="/screen3/senior-majoring.svg" alt="I am a senior majoring in"
            style={{ width: "clamp(180px, 38%, 380px)", height: "auto" }} />

          {/* "SYMBOLIC SYSTEMS" */}
          <img src="/screen3/symbolic-systems.svg" alt="Symbolic Systems"
            style={{ width: "clamp(240px, 58%, 520px)", height: "auto" }} />

          {/* HCI / HAI */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span style={{ fontFamily: "Georgia,serif", fontSize: "clamp(12px,1.2vw,16px)", color: "#1a1a2e" }}>(HCI</span>
            <img src="/screen3/hci-logo.svg" alt="HCI" style={{ width: "clamp(20px,2.2vw,28px)", height: "auto" }} />
            <span style={{ fontFamily: "Georgia,serif", fontSize: "clamp(12px,1.2vw,16px)", color: "#1a1a2e" }}>/</span>
            <img src="/screen3/hai-logo.svg" alt="HAI" style={{ width: "clamp(20px,2.2vw,28px)", height: "auto" }} />
            <span style={{ fontFamily: "Georgia,serif", fontSize: "clamp(12px,1.2vw,16px)", color: "#1a1a2e" }}>HAI CONCENTRATION)</span>
          </div>

          {/* AT STANFORD */}
          <p style={{ fontFamily: "monospace", fontWeight: 900, fontSize: "clamp(12px,1.4vw,18px)", color: "#E63329", margin: 0, letterSpacing: ".07em", textTransform: "uppercase" }}>
            AT STANFORD UNIVERSITY
          </p>

          {/* Description */}
          <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(11px,1.1vw,14px)", color: "#364153", margin: 0, lineHeight: 1.6, maxWidth: 480 }}>
            An interdisciplinary Bachelor of Science degree program designed to explore the relationship between the human mind and artificial systems.
          </p>

          {/* KEY PRINCIPLES + grid — no gap between them */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <img src="/screen3/keyprinciples.svg" alt="Key Principles"
              style={{ width: "clamp(180px, 48%, 400px)", height: "auto" }} />
            <img src="/screen3/principles.svg" alt="Principles"
              style={{ width: "clamp(240px, 68%, 560px)", height: "auto", marginTop: 2 }} />
          </div>
        </div>
      </div>

      {/* Bottom Bauhaus strip */}
      <div style={{
        height: "clamp(90px, 12vw, 155px)",
        backgroundImage: "url('/screen7/bauhaus-top.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        transform: "scaleY(-1)",
      }} />
    </section>
  );
}
