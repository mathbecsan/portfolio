"use client";

// ── Experience Page — blank canvas, ready to design from scratch ──

export default function ExperiencePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0d0d0d", color: "#f0ede6" }}>

      {/* Minimal nav — back to portfolio */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "20px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(13,13,13,0.9)", backdropFilter: "blur(8px)",
      }}>
        <a href="/" style={{
          display: "flex", alignItems: "center", gap: 10,
          textDecoration: "none",
        }}>
          <div style={{
            width: 32, height: 32, background: "#2952A3", borderRadius: 4,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontFamily: "monospace", fontWeight: 900, color: "#fff", fontSize: 12,
          }}>MB</div>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(240,237,230,0.6)", letterSpacing: "0.15em", textTransform: "uppercase" }}>
            ← Back to Portfolio
          </span>
        </a>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(240,237,230,0.3)", letterSpacing: "0.2em", textTransform: "uppercase" }}>
          Experience
        </span>
      </nav>

      {/* Content — blank canvas, ready for your design */}
      <div style={{ paddingTop: 80 }}>
        {/* 👋 This page is yours — start designing your experience/resume here */}
      </div>

    </main>
  );
}
