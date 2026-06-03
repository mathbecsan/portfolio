"use client";

// ── Screen 3: About — Symbolic Systems / Stanford ─────────────
// Layout: Bauhaus top strip → App.svg layout (left: photo, right: academic info) → Bauhaus bottom strip

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

      {/* ── Main content: App.svg as layout frame ── */}
      <div style={{ position: "relative" }}>
        <img
          src="/screen3/App.svg"
          alt="About Me — Symbolic Systems at Stanford"
          style={{ width: "100%", height: "auto", display: "block" }}
        />

        {/* ── Stanford photo — overlaid on left placeholder area ── */}
        {/* App.svg is 2849×1677. Left content area: x≈0–1350, y≈8–88% */}
        <div style={{
          position: "absolute",
          left: "2%",
          top: "8%",
          width: "44%",
          bottom: "12%",
          overflow: "hidden",
          borderRadius: "clamp(4px,0.5vw,8px)",
        }}>
          <img
            src="/stanford-photo.jpg"
            alt="Mathias Becerra at Stanford"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center 20%",
              display: "block",
            }}
          />
        </div>

        {/* ── HCI logo (overlaid on the (HCI / HAI) line in App.svg) ── */}
        {/* In App.svg the HCI icon is at roughly x≈56%, y≈28% */}
        <img
          src="/screen3/image-137.svg"
          alt="HCI"
          style={{
            position: "absolute",
            left: "56.5%",
            top: "27%",
            width: "2.5%",
            height: "auto",
            zIndex: 2,
          }}
        />

        {/* ── HAI logo ── roughly x≈62%, y≈28% */}
        <img
          src="/screen3/image-139.svg"
          alt="HAI"
          style={{
            position: "absolute",
            left: "62.5%",
            top: "27%",
            width: "2.5%",
            height: "auto",
            zIndex: 2,
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
