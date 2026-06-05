"use client";
import { use } from "react";

// ── Category metadata ─────────────────────────────────────────────────────
const CATEGORIES: Record<string, { title: string; description: string; accent: string; thumb: string }> = {
  "music-production":  { title: "Music Production",    description: "Original compositions, audio engineering, and sound design projects.", accent: "#1F2937", thumb: "/experience-screen3/musicproduction.mp4" },
  "graphic-design":    { title: "Graphic Design",       description: "Branding, illustration, and visual identity work.",                    accent: "#E63329", thumb: "/experience-screen3/graphicdesign.svg"   },
  "design":            { title: "Design",               description: "Explorations in visual language, layout, and conceptual design.",      accent: "#FBBF24", thumb: "/experience-screen3/design.png"          },
  "sketches":          { title: "Sketches",             description: "Concept sketches, ideation, and illustration studies.",               accent: "#3B82F6", thumb: "/experience-screen3/sketches.svg"         },
  "ethics":            { title: "Ethics",               description: "Research and projects at the intersection of technology and ethics.",  accent: "#1F2937", thumb: "/experience-screen3/ethics.svg"           },
  "logo-designs":      { title: "Logo Designs",         description: "Brand marks, logotypes, and identity systems.",                       accent: "#E63329", thumb: "/experience-screen3/logodesigns.png"      },
  "others":            { title: "Others",               description: "Miscellaneous creative projects and experiments.",                    accent: "#FBBF24", thumb: "/experience-screen3/others.svg"            },
  "uxui":              { title: "UX/UI Implementation", description: "End-to-end product design and front-end engineering projects.",       accent: "#3B82F6", thumb: "/experience-screen3/uxui.svg"             },
  "logo-story":        { title: "Logo Story",           description: "The evolution of the MATHBECSAN brand identity.",                    accent: "#1F2937", thumb: "/experience-screen4/logostory.mp4"         },
  "3d-modelling":      { title: "3D Modelling",         description: "3D models, renders, and spatial design explorations.",               accent: "#E63329", thumb: "/experience-screen4/3d-modelling.svg"      },
  "game-development":  { title: "Game Development",     description: "Indie games, interactive experiences, and game design projects.",    accent: "#FBBF24", thumb: "/experience-screen4/game-development.svg"  },
  "app-development":   { title: "App Development",      description: "Mobile and web apps built from concept to production.",              accent: "#3B82F6", thumb: "/experience-screen4/app-development.svg"   },
  "filmmaking":        { title: "Filmmaking",           description: "Short films, documentary work, and video production projects.",      accent: "#E63329", thumb: "/experience-screen4/filmmaking.mov"        },
  "web-development":   { title: "Web Development",      description: "Websites, web apps, and digital experiences.",                      accent: "#3B82F6", thumb: "/experience-screen4/web-development.svg"   },
  "electronics":       { title: "Electronics",          description: "Hardware projects, prototyping, and embedded systems.",              accent: "#1F2937", thumb: "/experience-screen4/electronics.svg"       },
  "research":          { title: "Research",             description: "Academic research, papers, and human-centered inquiry.",             accent: "#FBBF24", thumb: "/experience-screen4/research.svg"          },
  "miscellaneous":     { title: "Miscellaneous",        description: "Everything that defies a single category.",                         accent: "#E63329", thumb: "/experience-screen4/miscellaneous.svg"     },
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);
  const cat = CATEGORIES[category];
  const title = cat?.title ?? category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const description = cat?.description ?? "Projects and case studies in this category.";
  const accent = cat?.accent ?? "#E63329";

  return (
    <main style={{ background: "#FFF3DE", minHeight: "100vh" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "rgba(255,243,222,0.92)", backdropFilter: "blur(8px)",
        borderBottom: "1.5px solid rgba(31,41,55,0.08)",
      }}>
        <a href="/experience" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <img src="/experience-screen1/mathbecsanbrandnewlogo.svg" alt="MATHBECSAN" style={{ height: 26, width: "auto" }} />
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#1F2937", opacity: 0.5, letterSpacing: "0.15em" }}>← Experience</span>
        </a>
        <span style={{ fontFamily: "monospace", fontSize: 11, color: "#1F2937", opacity: 0.4, letterSpacing: "0.22em", textTransform: "uppercase" }}>
          {title}
        </span>
      </nav>

      {/* ── Hero ── */}
      <div style={{ paddingTop: 58 }}>
        <div style={{ background: accent, padding: "clamp(48px,7vw,96px) clamp(32px,6vw,80px)" }}>
          <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.22em", color: "rgba(255,255,255,0.6)", textTransform: "uppercase", margin: "0 0 12px" }}>
            Category
          </p>
          <h1 style={{
            fontFamily: "monospace", fontWeight: 900, fontSize: "clamp(40px,8vw,100px)",
            color: "#fff", margin: "0 0 16px", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "-0.02em",
          }}>{title}</h1>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(14px,1.4vw,18px)", color: "rgba(255,255,255,0.8)", margin: 0, maxWidth: 560, lineHeight: 1.65 }}>
            {description}
          </p>
        </div>
      </div>

      {/* ── Projects Grid ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(48px,6vw,80px) clamp(32px,6vw,80px)" }}>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "clamp(32px,4vw,48px)" }}>
          <div style={{ width: 4, height: 32, background: accent, borderRadius: 2 }} />
          <h2 style={{ fontFamily: "monospace", fontWeight: 700, fontSize: "clamp(14px,1.5vw,18px)", color: "#1F2937", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Projects & Case Studies
          </h2>
        </div>

        {/* ── Add your projects here ────────────────────────────────────────
            To add a project, copy the card below and fill in your details.
            ────────────────────────────────────────────────────────────────── */}

        {/* Empty state */}
        <div style={{
          border: `2px dashed ${accent}40`,
          borderRadius: 8,
          padding: "clamp(48px,6vw,80px) 40px",
          textAlign: "center",
          background: "rgba(255,255,255,0.4)",
        }}>
          <div style={{ width: 48, height: 48, borderRadius: "50%", background: accent, margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 24, fontWeight: 900 }}>+</span>
          </div>
          <p style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 16, color: "#1F2937", margin: "0 0 8px", letterSpacing: "0.05em" }}>
            No projects yet
          </p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "rgba(31,41,55,0.5)", margin: 0, maxWidth: 400, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
            Add your case studies, projects, and work to this section by editing{" "}
            <code style={{ background: "rgba(31,41,55,0.08)", padding: "2px 6px", borderRadius: 3, fontFamily: "monospace", fontSize: 12 }}>
              src/app/experience/[category]/page.tsx
            </code>
          </p>
        </div>

        {/* ── PROJECT CARD TEMPLATE (copy & uncomment to add projects) ──────
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24
        }}>
          <a href="#" style={{ textDecoration: "none", borderRadius: 8, overflow: "hidden", background: "#fff", border: "1px solid rgba(31,41,55,0.1)", transition: "transform 0.2s, box-shadow 0.2s", display: "block" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.1)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}>
            <div style={{ height: 200, background: "#f0f0f0" }}>
              <img src="YOUR_IMAGE_URL" alt="Project name" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "20px 24px 24px" }}>
              <p style={{ fontFamily: "monospace", fontSize: 11, color: accent, letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Tag / Year</p>
              <h3 style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 18, color: "#1F2937", margin: "0 0 8px" }}>Project Title</h3>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 14, color: "rgba(31,41,55,0.65)", margin: 0, lineHeight: 1.6 }}>Brief description of the project.</p>
            </div>
          </a>
        </div>
        ───────────────────────────────────────────────────────────────────── */}

      </div>
    </main>
  );
}
