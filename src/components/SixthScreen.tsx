"use client";

// ── Products grid ─────────────────────────────────────────────
const PRODUCTS = [
  { name: "GAMES",              sub: "Mobile & 3D",                 count: "2",   bg: "#E63329", icon: "🎮" },
  { name: "MOBILE APPS",        sub: "iOS/Android",                 count: "4",   bg: "#111111", icon: "📱" },
  { name: "WEB",                sub: "Websites & Platforms",        count: "6",   bg: "#F5C500", icon: "🌐" },
  { name: "FILMAKING",          sub: "Short Videoclips & movies",   count: "1",   bg: "#1B3F8B", icon: "🎬" },
  { name: "3D MODELING",        sub: "Games, Digital Pieces",       count: "3",   bg: "#E63329", icon: "📦" },
  { name: "GRAPHIC DESIGN",     sub: "Cartoons, Styles",            count: "10",  bg: "#111111", icon: "✏️" },
  { name: "MUSIC PRODUCTION",   sub: "Digital songs & soundtracks", count: "3",   bg: "#F5C500", icon: "🎵" },
  { name: "RESEARCH",           sub: "Posters & Papers",            count: "7",   bg: "#1B3F8B", icon: "🔬" },
  { name: "ART SKETCHES",       sub: "Storyboards, UIs",            count: "3",   bg: "#E63329", icon: "🎨" },
  { name: "UX/UI IMPLEMENTATION",sub: "Figma Screen Workflows",     count: "4",   bg: "#111111", icon: "⚡" },
  { name: "ELECTRONICS",        sub: "Robots, Devices & Prototypes",count: "1",   bg: "#F5C500", icon: "🔌" },
  { name: "MISCELLANEOUS",      sub: "MVPs",                        count: "10+", bg: "#1B3F8B", icon: "📁" },
];

function ProductsGrid() {
  return (
    <div style={{ background: "#F2EFE4", padding: "clamp(24px, 4vw, 48px) clamp(16px, 3vw, 32px)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "clamp(20px, 3vw, 36px)" }}>
        <div style={{
          width: "clamp(44px, 5vw, 64px)", height: "clamp(44px, 5vw, 64px)",
          borderRadius: "50%", border: "3px solid #1B3F8B",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#fff", flexShrink: 0,
        }}>
          <div style={{ width: "50%", height: "50%", background: "#E63329", borderRadius: "50%" }} />
        </div>
        <h3 style={{
          fontFamily: "monospace", fontWeight: 900,
          fontSize: "clamp(22px, 4vw, 48px)",
          color: "#0d0d0d", margin: 0, letterSpacing: ".02em",
        }}>PRODUCTS</h3>
        {/* Color bar */}
        <div style={{ display: "flex", gap: 3, marginLeft: 8 }}>
          {["#E63329","#111","#F5C500","#1B3F8B","#E63329","#111","#F5C500","#1B3F8B"].map((c,i) => (
            <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: "clamp(8px, 1.2vw, 16px)",
      }}>
        {PRODUCTS.map(p => (
          <div key={p.name} style={{
            background: p.bg,
            borderRadius: 4,
            padding: "clamp(10px, 1.5vw, 20px) clamp(8px, 1.2vw, 16px)",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: "clamp(6px, 1vw, 10px)",
            transition: "transform .2s ease, box-shadow .2s ease",
            cursor: "default",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,.3)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
          >
            {/* Icon */}
            <div style={{ fontSize: "clamp(24px, 3.5vw, 44px)", lineHeight: 1, filter: "drop-shadow(0 2px 4px rgba(0,0,0,.3))" }}>
              {p.icon}
            </div>
            {/* Name */}
            <p style={{
              fontFamily: "monospace", fontWeight: 900,
              fontSize: "clamp(7px, 0.85vw, 11px)",
              color: "#fff", margin: 0, textAlign: "center",
              letterSpacing: ".05em", lineHeight: 1.2,
              textTransform: "uppercase",
            }}>{p.name}</p>
            {/* Sub */}
            <p style={{
              fontFamily: "monospace",
              fontSize: "clamp(6px, 0.7vw, 9px)",
              color: "rgba(255,255,255,.65)", margin: 0,
              textAlign: "center", lineHeight: 1.3,
            }}>{p.sub}</p>
            {/* Count */}
            <p style={{
              fontFamily: "monospace", fontWeight: 900,
              fontSize: "clamp(14px, 2vw, 24px)",
              color: "#E63329", margin: 0,
              background: "rgba(255,255,255,.95)",
              padding: "2px 10px", borderRadius: 3,
            }}>{p.count}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Screen 6: Metrics of Impact ───────────────────────────────
// Layout (all parts share 1280px max-width):
//
//  ┌─────────────────────────────────────────┐  First Part  (1280×424)
//  ├────────────────────────┬────────────────┤  Second Part (740+524)
//  ├─────────────────────────────────────────┤  Third Part  (1277×802)
//  ├────────────────────────┬────────────────┤  Fourth Part (524+740)
//  ├─────────────────────────────────────────┤  Fifth Part  (1280×262)
//  └─────────────────────────────────────────┘  Fifth Part  (1280×185)

export default function SixthScreen() {
  return (
    <section style={{ background: "#111111", overflow: "hidden" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto" }}>

        {/* ── Part 1: Header — Metrics of Impact / Data Analysis ── */}
        <div>
          <img
            src="/screen6/first-part__Container.svg"
            alt="Metrics of Impact — Data Analysis header"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* ── Part 2: User Growth chart (left) + Total Users stats (right) ── */}
        <div style={{ display: "flex" }}>
          {/* Chart: 740 / (740+524) = 58.6% */}
          <div style={{ flex: "0 0 58.6%" }}>
            <img
              src="/screen6/second-part__Container.svg"
              alt="User Growth Across Products chart"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
          {/* Stats: 524 / 1264 = 41.4% */}
          <div style={{ flex: "1 1 0" }}>
            <img
              src="/screen6/second-part__Container-1.svg"
              alt="Total Users 5K — Products 10 — Countries"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>

        {/* ── Part 3: Products grid (coded — accurate counts) ── */}
        <ProductsGrid />

        {/* ── Part 4: Impact metrics (left) + Process metrics (right) ── */}
        <div style={{ display: "flex" }}>
          {/* Impact: 524 / 1264 = 41.4% */}
          <div style={{ flex: "0 0 41.4%" }}>
            <img
              src="/screen6/fourth-part__Container.svg"
              alt="Impact — 40% Time Saved, 2.3x Engagement, 91% Success Rate"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
          {/* Process: 740 / 1264 = 58.6% */}
          <div style={{ flex: "1 1 0" }}>
            <img
              src="/screen6/fourth-part__Container-1.svg"
              alt="Process — 45 User Interviews, 60+ Design Iterations, 100+ Research Hours, 14 APIs Integrated"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>

        {/* ── Part 5a: Bottom stats row ── */}
        <div>
          <img
            src="/screen6/fifth-part__Container.svg"
            alt="92% Satisfaction, 3.2K Waitlist, 63% Performance, 8 Startups"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

        {/* ── Part 5b: Design inspiration / footer text ── */}
        <div>
          <img
            src="/screen6/fifth-part__Container-1.svg"
            alt="Design inspiration and design system notes"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

      </div>
    </section>
  );
}
