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
      <div style={{ position: "relative" }}>
        <img
          src="/screen4/influences-new.png"
          alt="Influences — Bauhaus, Modernist Tradition, Swiss Grid, Form + Function"
          style={{ width: "100%", height: "auto", display: "block" }}
        />
        {/* Clickable hotspots over the artist portraits — learn more on Wikipedia */}
        <a
          href="https://en.wikipedia.org/wiki/Bauhaus"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Learn more about the Bauhaus movement"
          style={{
            position: "absolute",
            left: "12.5%",
            top: "10%",
            width: "16%",
            height: "32%",
            cursor: "pointer",
          }}
          className="influence-hotspot"
        />
        <a
          href="https://en.wikipedia.org/wiki/Modernism"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Learn more about the Modernist tradition"
          style={{
            position: "absolute",
            right: "1%",
            top: "53%",
            width: "16%",
            height: "32%",
            cursor: "pointer",
          }}
          className="influence-hotspot"
        />
        <style>{`
          .influence-hotspot { transition: box-shadow 0.2s ease, outline-color 0.2s ease; outline: 2px solid transparent; outline-offset: -2px; }
          .influence-hotspot:hover { outline-color: rgba(245,230,192,0.85); box-shadow: inset 0 0 0 2px rgba(245,230,192,0.85); }
        `}</style>
      </div>

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
