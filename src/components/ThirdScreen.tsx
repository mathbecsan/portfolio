"use client";

export default function ThirdScreen() {
  return (
    <section style={{ overflow: "hidden", background: "#F5E6C0" }}>
      {/* Top Bauhaus strip */}
      <div
        style={{
          height: "clamp(90px, 12vw, 155px)",
          backgroundImage: "url('/bauhaus-pattern.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      />

      {/* Main row: centered, fills full height between strips */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "stretch",
          minHeight: "clamp(480px, 62vw, 720px)",
        }}
      >
        {/* Photo — 40% wide, fills full height */}
        <div style={{ flex: "0 0 40%", overflow: "hidden" }}>
          <img
            src="/screen3/mathias-profile2.png"
            alt="Mathias Becerra"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block",
            }}
          />
        </div>

        {/* Content — 58% wide */}
        <div
          style={{
            flex: "1 1 0",
            padding: "clamp(20px, 3vw, 40px) clamp(24px, 3.5vw, 52px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "clamp(6px, 0.9vw, 12px)",
            position: "relative",
          }}
        >
          {/* Stanford S — top right, bigger */}
          <img
            src="/screen3/image-136.svg"
            alt="Stanford"
            style={{
              position: "absolute",
              top: "clamp(300px,20vw,20px)",
              right: "clamp(-150px,-50vw,70px)",
              width: "clamp(100px,70vw,300px)",
              height: "auto",
            }}
          />

          {/* "I AM A SENIOR MAJORING IN" */}
          <img
            src="/screen3/senior-majoring.svg"
            alt="I am a senior majoring in"
            style={{ width: "clamp(200px, 150%, 600px)", height: "auto" }}
          />

          {/* "SYMBOLIC SYSTEMS" — bigger */}
          <img
            src="/screen3/symbolic-systems.svg"
            alt="Symbolic Systems"
            style={{ width: "clamp(260px, 72%, 600px)", height: "auto" }}
          />

          {/* HCI / HAI */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                fontFamily: "Georgia,serif",
                fontSize: "clamp(12px,1.3vw,17px)",
                color: "#1a1a2e",
              }}
            >
              (HCI
            </span>
            <img
              src="/screen3/hci-logo.svg"
              alt="HCI"
              style={{ width: "clamp(20px,2.4vw,30px)", height: "auto" }}
            />
            <span
              style={{
                fontFamily: "Georgia,serif",
                fontSize: "clamp(12px,1.3vw,17px)",
                color: "#1a1a2e",
              }}
            >
              /
            </span>
            <img
              src="/screen3/hai-logo.svg"
              alt="HAI"
              style={{ width: "clamp(20px,2.4vw,30px)", height: "auto" }}
            />
            <span
              style={{
                fontFamily: "Georgia,serif",
                fontSize: "clamp(12px,1.3vw,17px)",
                color: "#1a1a2e",
              }}
            >
              HAI CONCENTRATION)
            </span>
          </div>

          {/* AT STANFORD */}
          <p
            style={{
              fontFamily: "monospace",
              fontWeight: 900,
              fontSize: "clamp(12px,1.5vw,20px)",
              color: "#E63329",
              margin: 0,
              letterSpacing: ".07em",
              textTransform: "uppercase",
            }}
          >
            AT STANFORD UNIVERSITY
          </p>

          {/* Description */}
          <p
            style={{
              fontFamily: "Georgia,serif",
              fontSize: "clamp(18px, 1.5vw, 24px)",
              color: "#364153",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: 500,
            }}
          >
            An interdisciplinary Bachelor of Science degree program designed to
            explore the relationship between the human mind and artificial
            systems.
          </p>

          {/* KEY PRINCIPLES flush with grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <img
              src="/screen3/keyprinciples.svg"
              alt="Key Principles"
              style={{ width: "clamp(200px, 50%, 440px)", height: "auto" }}
            />
            <img
              src="/screen3/principles.svg"
              alt="Principles"
              style={{
                width: "clamp(300px, 90%, 600px)",
                height: "auto",
                marginTop: "-50px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Bauhaus strip */}
      <div
        style={{
          height: "clamp(90px, 12vw, 155px)",
          backgroundImage: "url('/screen7/bauhaus-top.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          transform: "scaleY(-1)",
        }}
      />
    </section>
  );
}
