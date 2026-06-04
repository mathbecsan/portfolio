"use client";

export default function FourthScreen() {
  return (
    <section style={{ background: "#F5E6C0", overflow: "hidden" }}>
      {/* Top Bauhaus strip */}
      <div style={{
        height: "clamp(90px, 12vw, 155px)",
        backgroundImage: "url('/bauhaus-pattern.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }} />

      {/* Main Influences layout */}
      <img
        src="/screen4/influences-new.png"
        alt="Influences — Bauhaus, Modernist Tradition, Swiss Grid, Form + Function"
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      {/* Thin strip */}
      <img
        src="/screen4/influences-container.png"
        alt=""
        aria-hidden="true"
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      {/* Clean Bauhaus transition strip */}
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
