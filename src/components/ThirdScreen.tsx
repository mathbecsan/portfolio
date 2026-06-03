"use client";

// Screen 3: About — Symbolic Systems / Stanford
// App.svg is 2849×1677.
// Right column starts at x≈1443 (50.6%).
// "(HCI / HAI)" line is at approximately y≈32–37% of SVG height.
// Left photo placeholder: x=2%–47%, y=8%–88%.

export default function ThirdScreen() {
  return (
    <section style={{ overflow: "hidden" }}>

      {/* ── Top Bauhaus strip ── */}
      <div style={{
        height: "clamp(100px, 13vw, 170px)",
        backgroundImage: "url('/bauhaus-pattern.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }} />

      {/* ── App.svg layout + overlays ── */}
      <div style={{ position: "relative", lineHeight: 0 }}>
        <img
          src="/screen3/App.svg"
          alt="About — Symbolic Systems at Stanford"
          style={{ width: "100%", height: "auto", display: "block" }}
        />

        {/* ── Mathias photo ── */}
        <div style={{
          position: "absolute",
          left:   "3%",
          top:    "8%",
          width:  "43%",
          bottom: "12%",
          overflow: "hidden",
          borderRadius: "clamp(6px, 0.6vw, 12px)",
        }}>
          <img
            src="/screen3/mathias-profile.png"
            alt="Mathias Becerra at Stanford"
            style={{
              width: "100%", height: "100%",
              objectFit: "cover", objectPosition: "center 15%",
              display: "block",
            }}
          />
        </div>

        {/* ── HCI logo — after "HCI" text in the (HCI / HAI) line ── */}
        <img
          src="/screen3/hci-logo.svg"
          alt="HCI"
          style={{
            position: "absolute",
            left:      "54.8%",
            top:       "32%",
            width:     "2.4%",
            height:    "auto",
            zIndex:    2,
          }}
        />

        {/* ── HAI logo — after "HAI" text ── */}
        <img
          src="/screen3/hai-logo.svg"
          alt="HAI"
          style={{
            position: "absolute",
            left:      "60.5%",
            top:       "32%",
            width:     "2.4%",
            height:    "auto",
            zIndex:    2,
          }}
        />
      </div>

      {/* ── Bottom Bauhaus strip ── */}
      <div style={{
        height: "clamp(100px, 13vw, 170px)",
        backgroundImage: "url('/screen7/bauhaus-top.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        transform: "scaleY(-1)",
      }} />
    </section>
  );
}
