"use client";

// ── Experience / Resume Screen ────────────────────────────────
// Full-screen section for work experience, education, skills, etc.

const EXPERIENCE = [
  {
    role: "UX/UI Engineer Intern",
    org: "Google",
    period: "Summer 2025",
    desc: "Worked on accessible user interfaces for Google products.",
    color: "#E63329",
  },
  {
    role: "Research Assistant",
    org: "Stanford HAI",
    period: "2024 – Present",
    desc: "Human-Centered AI research at the Stanford Institute for Human-Centered AI.",
    color: "#2952A3",
  },
  {
    role: "Product Designer",
    org: "UNDP",
    period: "2023 – 2024",
    desc: "Designed digital tools for UN Development Programme initiatives.",
    color: "#F5C500",
  },
];

const EDUCATION = [
  {
    degree: "B.S. Symbolic Systems",
    school: "Stanford University",
    period: "2022 – 2026",
    detail: "Concentration: HCI / HAI · GPA: TBD",
    color: "#8C1515",
  },
];

const SKILLS = [
  { cat: "Design",      items: ["Figma", "Prototyping", "UX Research", "Design Systems"]   },
  { cat: "Engineering", items: ["React", "Next.js", "TypeScript", "Three.js", "Python"]     },
  { cat: "Research",    items: ["User Interviews", "Usability Testing", "Data Analysis"]    },
  { cat: "Languages",   items: ["Spanish", "English", "Quechua (heritage)", "Portuguese"]  },
];

export default function ExperienceScreen() {
  return (
    <section id="experience" style={{ background: "#0d0d0d", overflow: "hidden", minHeight: "100vh" }}>

      {/* ── Top Bauhaus strip ── */}
      <div style={{
        height: "clamp(80px, 10vw, 130px)",
        backgroundImage: "url('/bauhaus-pattern.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }} />

      {/* ── Content ── */}
      <div style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "clamp(48px, 7vw, 96px) clamp(24px, 6vw, 80px) clamp(64px, 8vw, 100px)",
      }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: "clamp(40px, 6vw, 72px)" }}>
          <div style={{ display: "flex", gap: 4 }}>
            {["#E63329","#F5C500","#2952A3"].map(c => (
              <div key={c} style={{ width: 5, height: 36, background: c, borderRadius: 2 }} />
            ))}
          </div>
          <h2 style={{
            fontFamily: "var(--font-geist-sans), sans-serif", fontWeight: 900,
            fontSize: "clamp(28px, 5vw, 64px)",
            color: "#f0ede6", margin: 0, letterSpacing: "-.01em",
            textTransform: "uppercase",
          }}>Experience</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "clamp(32px, 5vw, 64px)" }}>

          {/* Work Experience */}
          <div>
            <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 11, letterSpacing: ".2em", color: "rgba(240,237,230,.35)", textTransform: "uppercase", margin: "0 0 20px" }}>
              Work
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {EXPERIENCE.map(e => (
                <div key={e.role} style={{
                  borderLeft: `3px solid ${e.color}`,
                  paddingLeft: 20,
                }}>
                  <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontWeight: 700, fontSize: "clamp(14px, 1.4vw, 18px)", color: "#f0ede6", margin: "0 0 4px" }}>{e.role}</p>
                  <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 12, color: e.color, margin: "0 0 6px", letterSpacing: ".06em" }}>{e.org} · {e.period}</p>
                  <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(12px, 1.1vw, 15px)", color: "rgba(240,237,230,.6)", margin: 0, lineHeight: 1.6 }}>{e.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 11, letterSpacing: ".2em", color: "rgba(240,237,230,.35)", textTransform: "uppercase", margin: "0 0 20px" }}>
              Education
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              {EDUCATION.map(e => (
                <div key={e.degree} style={{ borderLeft: `3px solid ${e.color}`, paddingLeft: 20 }}>
                  <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontWeight: 700, fontSize: "clamp(14px, 1.4vw, 18px)", color: "#f0ede6", margin: "0 0 4px" }}>{e.degree}</p>
                  <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 12, color: e.color, margin: "0 0 6px", letterSpacing: ".06em" }}>{e.school} · {e.period}</p>
                  <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(12px, 1.1vw, 15px)", color: "rgba(240,237,230,.6)", margin: 0, lineHeight: 1.6 }}>{e.detail}</p>
                </div>
              ))}
            </div>

            {/* Skills */}
            <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 11, letterSpacing: ".2em", color: "rgba(240,237,230,.35)", textTransform: "uppercase", margin: "36px 0 20px" }}>
              Skills
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {SKILLS.map(s => (
                <div key={s.cat}>
                  <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 11, color: "#F5C500", letterSpacing: ".1em", textTransform: "uppercase", margin: "0 0 8px" }}>{s.cat}</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {s.items.map(item => (
                      <span key={item} style={{
                        fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 11,
                        color: "rgba(240,237,230,.7)",
                        border: "1px solid rgba(240,237,230,.15)",
                        padding: "4px 10px", borderRadius: 3,
                      }}>{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bauhaus strip ── */}
      <div style={{
        height: "clamp(80px, 10vw, 130px)",
        backgroundImage: "url('/bauhaus-pattern.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        transform: "scaleY(-1)",
      }} />
    </section>
  );
}
