"use client";

const BASE = "/app-dev/metrics";

export default function MetricsPage() {
  return (
    <main style={{ background: "#F5F1E8", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "10px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(245,241,232,0.95)", backdropFilter: "blur(8px)",
        borderBottom: "1.5px solid rgba(31,41,55,0.08)",
      }}>
        <a href="/experience/app-development" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/experience-screen1/mathbecsanbrandnewlogo.svg" alt="MATHBECSAN" style={{ height: 22 }} />
          <span style={{ fontFamily: "monospace", fontSize: 10, color: "#1F2937", opacity: 0.5, letterSpacing: "0.15em" }}>← App Development</span>
        </a>
        <img src="/app-dev/logo.svg" alt="Speak.io" style={{ height: 24, width: "auto" }} />
      </nav>

      {/* ── Top Bauhaus strip ── */}
      <div style={{ paddingTop: 48, lineHeight: 0, overflow: "hidden" }}>
        <img src="/app-dev/bauhaus-top.svg" alt="" style={{ width: "100%", height: "clamp(40px,4.5vw,60px)", objectFit: "cover", display: "block" }} />
      </div>

      {/* ══ CONTENT ══════════════════════════════════════════════════════════ */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(20px,3vw,40px) clamp(16px,3vw,40px)" }}>

        {/* ── ROW 1: Hero header ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 0.7fr", gap: 24, alignItems: "center", marginBottom: 32 }}>

          {/* Left: SPEAK.IO wordmark + subtitle */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <img src={`${BASE}/speakio intro.svg`} alt="SPEAK.IO" style={{ width: "100%", maxWidth: 380, height: "auto" }} />
            <div style={{ paddingLeft: 4 }}>
              <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.18em", color: "#555", textTransform: "uppercase", margin: "0 0 4px" }}>Language Education App</p>
              <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.18em", color: "#555", textTransform: "uppercase", margin: 0 }}>Portfolio Case Study</p>
            </div>
            <img src={`${BASE}/IMPACT METRICS.svg`} alt="IMPACT METRICS" style={{ width: "clamp(160px,20vw,260px)", height: "auto", marginTop: 8 }} />
          </div>

          {/* Center: chameleon */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "flex-end" }}>
            <img src={`${BASE}/prismthechamaleon.svg`} alt="Prism the Chameleon" style={{ width: "100%", maxWidth: 420, height: "auto" }} />
          </div>

          {/* Right: Human Purpose quote */}
          <div style={{
            background: "#FEFCE8", border: "1.5px solid #E5E7EB", borderRadius: 10,
            padding: "16px 18px",
          }}>
            <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.15em", color: "#E7000B", textTransform: "uppercase", margin: "0 0 8px" }}>Human Purpose</p>
            <p style={{ fontFamily: "sans-serif", fontWeight: 700, fontSize: 15, color: "#111", lineHeight: 1.35, margin: 0 }}>
              Breaking language barriers through conversation &amp; accessible learning
            </p>
          </div>

        </div>

        {/* ── ROW 2: Main stats wide block ── */}
        <div style={{ marginBottom: 24 }}>
          <img src={`${BASE}/Container (4) copy.svg`} alt="Impact metrics stats" style={{ width: "100%", height: "auto", display: "block", borderRadius: 12 }} />
        </div>

        {/* ── ROW 3: Technology Stack (left) + Features Developed (right) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, alignItems: "start", marginBottom: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <img src={`${BASE}/TECHNOLOGY STACK.svg`} alt="Technology Stack" style={{ width: "clamp(180px,22vw,320px)", height: "auto" }} />
            <img src={`${BASE}/Container (6).svg`} alt="Technology stack detail" style={{ width: "100%", height: "auto", borderRadius: 10 }} />
          </div>
          {/* Container (7) = Features Developed with 11+ breakdown */}
          <img src={`${BASE}/Container (7).svg`} alt="Features developed" style={{ width: "100%", height: "auto", borderRadius: 10 }} />
        </div>

        {/* ── ROW 4: Dark quote + % Engagement (left) | DAU + Interviews + Hours (right) ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: 20, alignItems: "start", marginBottom: 20 }}>
          {/* Left: dark quote block stacked above % engagement */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <img src={`${BASE}/Container (margin).svg`} alt="Quote block" style={{ width: "100%", height: "auto", borderRadius: 10 }} />
            <img src={`${BASE}/Container (6) copy.svg`} alt="% Engagement" style={{ width: "100%", height: "auto", borderRadius: 10 }} />
          </div>
          {/* Right: daily active users + interviews + hours stacked */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <img src={`${BASE}/Container (8).svg`} alt="Daily active users" style={{ width: "100%", height: "auto", borderRadius: 10 }} />
            <img src={`${BASE}/Container (7) copy.svg`} alt="Interviews" style={{ width: "100%", height: "auto", borderRadius: 10 }} />
            <img src={`${BASE}/Container (9).svg`} alt="Hours of development" style={{ width: "100%", height: "auto", borderRadius: 10 }} />
          </div>
        </div>

        {/* ── ROW 6: 4 Phone Screenshots ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
          {["screen1","screen2","screen3","screen4"].map(s => (
            <img key={s} src={`${BASE}/${s}.svg`} alt={s} style={{ width: "100%", height: "auto", borderRadius: 16, boxShadow: "0 8px 28px rgba(0,0,0,0.15)" }} />
          ))}
        </div>

        {/* ── ROW 7: User Growth Over Time ── */}
        <div style={{ marginBottom: 8 }}>
          <p style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: "#111", margin: "0 0 12px" }}>
            User Growth Over Time &nbsp;
            <span style={{ fontSize: 14 }}>📈</span>
          </p>
          <img src={`${BASE}/Container (8) copy.svg`} alt="User growth chart" style={{ width: "100%", height: "auto", borderRadius: 10, display: "block" }} />
        </div>

      </div>

      {/* ── Bottom Bauhaus strip ── */}
      <div style={{ lineHeight: 0, overflow: "hidden" }}>
        <img src="/app-dev/bauhaus-bottom.svg" alt="" style={{ width: "100%", height: "clamp(40px,4.5vw,60px)", objectFit: "cover", display: "block" }} />
      </div>

    </main>
  );
}
