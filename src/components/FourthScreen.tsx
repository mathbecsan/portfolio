"use client";

export default function FourthScreen() {
  return (
    <section style={{ overflow: "hidden" }}>

      {/* INFLUENCES header strip — goes FIRST */}
      <img
        src="/screen4/influences-container.png"
        alt="Influences"
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      {/* Main Influences grid */}
      <img
        src="/screen4/influences-new.png"
        alt="Influences — Bauhaus, Modernist Tradition, Swiss Grid, Form + Function"
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      {/* Clean Bauhaus transition to next section */}
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
