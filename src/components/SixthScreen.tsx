"use client";

// ── Products grid: original SVG + number overlays ─────────────
// SVG is 1277×802. Cards start after header (~22% from top).
// Row 1 numbers at ~56% of SVG height; Row 2 at ~93%.
// 6 equal columns: centers at 8.3%, 25%, 41.7%, 58.3%, 75%, 91.7%.
const COUNTS = ["2","4","6","1","3","10","3","7","3","4","1","10+"];

function ProductsGrid() {
  // 6 columns × 2 rows
  const xCenters = [8.33, 25, 41.67, 58.33, 75, 91.67];
  const yRows    = [56, 93]; // % of SVG height

  return (
    <div style={{ position: "relative", lineHeight: 0 }}>
      <img
        src="/screen6/third-part__Container.svg"
        alt="Products"
        style={{ width: "100%", height: "auto", display: "block" }}
      />
      {/* Number overlays */}
      {COUNTS.map((count, i) => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        return (
          <div key={i} style={{
            position: "absolute",
            left:   `${xCenters[col]}%`,
            top:    `${yRows[row]}%`,
            transform: "translate(-50%, -50%)",
            background: "#fff",
            color: "#E63329",
            fontFamily: "monospace",
            fontWeight: 900,
            fontSize: "clamp(10px, 1.8vw, 22px)",
            lineHeight: 1,
            padding: "2px 8px",
            borderRadius: 2,
            pointerEvents: "none",
            zIndex: 2,
          }}>
            {count}
          </div>
        );
      })}
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
