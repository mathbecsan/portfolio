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
          flexWrap: "wrap",
          alignItems: "stretch",
          minHeight: "clamp(480px, 62vw, 720px)",
        }}
      >
        {/* Photo — framed, no awkward clipping across breakpoints */}
        <div
          style={{
            flex: "1 1 320px",
            minHeight: "clamp(280px, 40vw, 480px)",
            padding: "clamp(20px, 3vw, 40px)",
            display: "flex",
          }}
        >
          <div
            style={{
              position: "relative",
              width: "100%",
              borderRadius: "16px",
              overflow: "hidden",
              border: "4px solid #0d0d0d",
              boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
            }}
          >
            <img
              src="/screen3/mathias-profile2.png"
              alt="Mathias Becerra"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "50% 22%",
                aspectRatio: "4 / 5",
                display: "block",
              }}
            />
            {/* Stanford S — badge over the bottom-right corner */}
            <img
              src="/screen3/image-136.svg"
              alt="Stanford"
              style={{
                position: "absolute",
                bottom: "clamp(8px, 1.5vw, 16px)",
                right: "clamp(8px, 1.5vw, 16px)",
                width: "clamp(110px, 20vw, 200px)",
                height: "auto",
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div
          style={{
            flex: "1 1 380px",
            padding: "clamp(20px, 3vw, 40px) clamp(24px, 3.5vw, 52px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "clamp(14px, 1.6vw, 22px)",
          }}
        >
          {/* "I AM A SENIOR MAJORING IN" */}
          <img
            src="/screen3/senior-majoring.svg"
            alt="I am a senior majoring in"
            style={{ width: "clamp(380px, 100%, 720px)", height: "auto" }}
          />

          {/* "SYMBOLIC SYSTEMS" */}
          <img
            src="/screen3/symbolic-systems.svg"
            alt="Symbolic Systems"
            style={{ width: "clamp(320px, 88%, 720px)", height: "auto" }}
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
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontWeight: 500,
                fontSize: "clamp(13px,1.3vw,17px)",
                color: "#364153",
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
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontWeight: 500,
                fontSize: "clamp(13px,1.3vw,17px)",
                color: "#364153",
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
                fontFamily: "var(--font-geist-sans), sans-serif",
                fontWeight: 500,
                fontSize: "clamp(13px,1.3vw,17px)",
                color: "#364153",
              }}
            >
              Concentration)
            </span>
          </div>

          {/* AT STANFORD */}
          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontWeight: 800,
              fontSize: "clamp(12px, 1.4vw, 18px)",
              color: "#E63329",
              margin: 0,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            At Stanford University
          </p>

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontWeight: 400,
              fontSize: "clamp(15px, 1.4vw, 19px)",
              color: "#364153",
              margin: 0,
              lineHeight: 1.6,
              maxWidth: 480,
            }}
          >
            An interdisciplinary Bachelor of Science degree program designed to
            explore the relationship between the human mind and artificial
            systems.
          </p>

          {/* Key Principles */}
          <div style={{ marginTop: "clamp(-8px, -0.4vw, -2px)" }}>
            <p
              style={{
                fontFamily: "var(--font-bebas), sans-serif",
                fontWeight: 400,
                fontSize: "clamp(20px, 2.6vw, 32px)",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                color: "#0d0d0d",
                margin: "0 0 12px",
              }}
            >
              Key Principles
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(160px, 1fr))",
                gap: "clamp(10px, 1.2vw, 16px)",
                maxWidth: 520,
              }}
            >
              {[
                { text: "Ship early, refine later.", color: "#E63329", shape: "circle" },
                { text: "Design for accessibility.", color: "#2952A3", shape: "square" },
                { text: "Lead with kindness.", color: "#F5C500", shape: "triangle" },
                { text: "Stay open to feedback.", color: "#0d0d0d", shape: "circle" },
              ].map(({ text, color, shape }) => (
                <div
                  key={text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    border: "1px solid #0d0d0d",
                    borderRadius: 10,
                    padding: "clamp(10px, 1.2vw, 14px)",
                    background: "rgba(13,13,13,0.03)",
                  }}
                >
                  {shape === "circle" && (
                    <span style={{
                      flexShrink: 0,
                      width: "clamp(12px,1.4vw,18px)",
                      height: "clamp(12px,1.4vw,18px)",
                      borderRadius: "50%",
                      background: color,
                    }} />
                  )}
                  {shape === "square" && (
                    <span style={{
                      flexShrink: 0,
                      width: "clamp(12px,1.4vw,18px)",
                      height: "clamp(12px,1.4vw,18px)",
                      background: color,
                    }} />
                  )}
                  {shape === "triangle" && (
                    <span style={{
                      flexShrink: 0,
                      width: 0,
                      height: 0,
                      borderLeft: "clamp(7px,0.8vw,9px) solid transparent",
                      borderRight: "clamp(7px,0.8vw,9px) solid transparent",
                      borderBottom: "clamp(12px,1.4vw,18px) solid " + color,
                    }} />
                  )}
                  <p
                    style={{
                      fontFamily: "var(--font-geist-sans), sans-serif",
                      fontWeight: 600,
                      fontSize: "clamp(13px, 1.1vw, 15.5px)",
                      color: "#364153",
                      lineHeight: 1.4,
                      margin: 0,
                    }}
                  >
                    {text}
                  </p>
                </div>
              ))}
            </div>
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
