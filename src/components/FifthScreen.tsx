"use client";

export default function FifthScreen() {
  return (
    <section id="process" style={{ overflow: "hidden", scrollMarginTop: 0 }}>
      <img
        src="/screen5/bauhaus-editorial-booklet.svg"
        alt="Design Process — Bauhaus Editorial Booklet"
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      {/* Bauhaus strip — transition to Metrics of Impact */}
      <div style={{
        height: "clamp(90px, 12vw, 155px)",
        backgroundImage: "url('/bauhaus-pattern.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }} />
    </section>
  );
}
