"use client";

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
        <div>
          <img
            src="/screen6/third-part__Container.svg"
            alt="Products"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>

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
