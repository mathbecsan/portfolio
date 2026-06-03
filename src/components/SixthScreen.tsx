"use client";

// ── Products: counts & research icon ──────────────────────────
// counts[i] matches card order: Games, Mobile Apps, Web, Filmaking,
// 3D Modeling, Graphic Design, Music Production, Research,
// Art Sketches, UX/UI Impl, Electronics, Miscellaneous
const PRODUCT_COUNTS = [2, 4, 6, 1, 3, 10, 3, 7, 3, 4, 1, 10];

// SVG viewport: 1277×802
// Cards start at y≈180 (22.4%). Each row ≈ 304px tall (37.9%).
// Numbers sit at bottom of each card, ~y≈455 (row1) and ~y≈758 (row2).
// 6 equal-width cards: centers at x = 106, 319, 532, 745, 958, 1171.
// As % of 1277: 8.3%, 25%, 41.7%, 58.3%, 75%, 91.7%
// As % of 802:  row1 = 56.7%, row2 = 94.5%

// Research card is column index 1 in row 2 (index 7 overall).
// Its icon area is at x≈319, y≈255–445.

function ProductsSection() {
  // 6 card centers as % of SVG width (1277px)
  const xPct = [8.3, 25.1, 41.6, 58.2, 74.8, 91.5];
  // Number badge y-center as % of SVG height (802px)
  // Numbers sit just below the description text of each card row
  // Row 1: ~78.5%, Row 2: ~96.5%
  const yPct = [78.5, 96.5];

  return (
    <div style={{ position: "relative", lineHeight: 0 }}>
      <img src="/screen6/third-part__Container.svg" alt="Products"
        style={{ width: "100%", height: "auto", display: "block" }} />

      {/* ── Number overlays ── */}
      {PRODUCT_COUNTS.map((count, i) => {
        const col     = i % 6;
        const row     = Math.floor(i / 6);
        const numFile = String(count); // 10.svg covers both 10 and 10+
        return (
          <img
            key={i}
            src={`/screen6/numbers/${numFile}.svg`}
            alt={String(count)}
            style={{
              position:  "absolute",
              left:      `${xPct[col]}%`,
              top:       `${yPct[row]}%`,
              transform: "translate(-50%, -50%)",
              width:     "2.8%",   // ~36px in 1277px SVG
              height:    "auto",
              zIndex:    2,
              pointerEvents: "none",
            }}
          />
        );
      })}

      {/* Miscellaneous "+ " suffix (index 11) */}
      <div style={{
        position:   "absolute",
        left:       `calc(${xPct[5]}% + 1.6%)`,
        top:        `${yPct[1]}%`,
        transform:  "translate(0, -50%)",
        fontFamily: "monospace", fontWeight: 900,
        fontSize:   "clamp(8px, 1.4vw, 18px)",
        color:      "#E63329",
        zIndex:     3,
        pointerEvents: "none",
        lineHeight: 1,
      }}>+</div>

      {/* ── Research icon overlay (card row2 col1, index 7) ── */}
      {/* Card icon area center: x≈25.1%, y≈64% of SVG */}
      <img
        src="/screen6/research-icon.svg"
        alt="Research"
        style={{
          position:  "absolute",
          left:      "25.1%",
          top:       "64%",
          transform: "translate(-50%, -50%)",
          width:     "10%",
          height:    "auto",
          zIndex:    2,
          pointerEvents: "none",
        }}
      />
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

        {/* ── Part 3: Products grid ── */}
        <ProductsSection />

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
