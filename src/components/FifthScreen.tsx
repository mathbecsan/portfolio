"use client";

export default function FifthScreen() {
  return (
    <section id="process" style={{ overflow: "hidden", scrollMarginTop: 0 }}>
      <div style={{ position: "relative", lineHeight: 0 }}>
        <img
          src="/screen5/body.svg"
          alt="Design Process — Research, Structure, Iterate, Deliver"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        {/* Bauhaus strip overlaps the black bottom of the SVG */}
        <div style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          height: "clamp(90px, 12vw, 155px)",
          backgroundImage: "url('/bauhaus-pattern.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }} />
      </div>
    </section>
  );
}
