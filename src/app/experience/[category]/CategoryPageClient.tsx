"use client";
import { use } from "react";
import ComingSoon from "@/components/ComingSoon";
import SiteNav, { PageHero } from "@/components/SiteNav";

// ── Category metadata ─────────────────────────────────────────────────────
const CATEGORIES: Record<string, { title: string; description: string; accent: string; thumb: string }> = {
  "music-production":  { title: "Music Production",    description: "Original compositions, audio engineering, and sound design projects.", accent: "#1F2937", thumb: "/experience-screen3/musicproduction.mp4" },
  "human-robot-interaction": { title: "Human-Robot Interaction", description: "Designing how people and robots communicate, collaborate, and build trust.", accent: "#E63329", thumb: "/experience-screen3/hri-7eff3147.webp" },
  "data-visualization": { title: "Data Visualization", description: "Turning complex data into clear, honest, and engaging visual stories.", accent: "#FBBF24", thumb: "/experience-screen3/data-visualization-fb352c8b.mp4" },
  "digital-fabrication": { title: "Digital Fabrication", description: "3D printing, laser cutting, and turning digital models into physical objects.", accent: "#3B82F6", thumb: "/experience-screen3/digital-fabrication-0070749c.webp" },
  "photography": { title: "Photography", description: "Portraits, places, and moments captured through the lens.", accent: "#1F2937", thumb: "/experience-screen3/photography-5abf5689.webp" },
  "immersive-technologies": { title: "Immersive Technologies",    description: "Immersive experiences across virtual, augmented, extended, and mixed reality.", accent: "#E63329", thumb: "/experience-screen3/xr-d4098b87.webp" },
  "visual-arts-crafting": { title: "Visual Arts & Crafting", description: "Painting, illustration, and hands-on craft work.", accent: "#FBBF24", thumb: "/experience-screen3/visual-arts-crafting-6b251eff.webp" },
  "uxui":              { title: "UX/UI Implementation", description: "End-to-end product design and front-end engineering projects.",       accent: "#3B82F6", thumb: "/experience-screen3/uxui.svg"             },
  "personal-artifacts": { title: "Personal Artifacts", description: "The objects, brand marks, and keepsakes behind the MATHBECSAN story.",                    accent: "#1F2937", thumb: "/experience-screen4/logostory.mp4"         },
  "physical-digital-animation": { title: "Physical and Digital Animation", description: "Character animation across hand-drawn, stop-motion, and digital tools.", accent: "#E63329", thumb: "/experience-screen4/physical-digital-animation-99397d83.webp" },
  "game-development":  { title: "Game Development",     description: "Indie games, interactive experiences, and game design projects.",    accent: "#FBBF24", thumb: "/experience-screen4/game-development-761817d4.webp"  },
  "app-development":   { title: "App Development",      description: "Mobile and web apps built from concept to production.",              accent: "#3B82F6", thumb: "/experience-screen4/app-development.svg"   },
  "filmmaking":        { title: "Filmmaking",           description: "Short films, documentary work, and video production projects.",      accent: "#E63329", thumb: "/experience-screen4/filmmaking-72c87e3a.mp4"        },
  "web-development":   { title: "Web Development",      description: "Websites, web apps, and digital experiences.",                      accent: "#3B82F6", thumb: "/experience-screen4/web-development-fdd1f636.webp"   },
  "physical-computing-hardware": { title: "Physical Computing & Hardware", description: "Microcontrollers, sensors, prototyping, and embedded systems.",              accent: "#1F2937", thumb: "/experience-screen4/electronics-4ddf0a91.webp"       },
  "ai-governance-research": { title: "AI Governance Research", description: "Research on the policy, ethics, and governance of AI systems.",             accent: "#FBBF24", thumb: "/experience-screen4/research.svg"          },
  "community-education": { title: "Community-Centered Education Prototypes", description: "Learning tools co-designed with families, students, and educators.", accent: "#E63329", thumb: "/experience-screen4/community-education-ced63005.webp" },
};

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = use(params);

  // Redirect categories with dedicated pages
  if (category === "app-development" && typeof window !== "undefined") {
    window.location.replace("/experience/app-development");
    return null;
  }

  const cat = CATEGORIES[category];
  const title = cat?.title ?? category.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const description = cat?.description ?? "Projects and case studies in this category.";
  const accent = cat?.accent ?? "#E63329";

  return (
    <main style={{ background: "#FFF3DE", minHeight: "100vh" }}>

      <SiteNav current="Projects" />

      <PageHero
        eyebrow="Field"
        title={title}
        intro={description}
        accent={accent === "#1F2937" ? "var(--cream)" : accent}
        crumbs={[{ label: "Projects", href: "/projects" }, { label: title }]}
      />

      {/* ── Projects Grid ── */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "clamp(48px,6vw,80px) var(--gutter)" }}>

        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "clamp(32px,4vw,48px)" }}>
          <div style={{ width: 4, height: 32, background: accent, borderRadius: 2 }} />
          <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(14px,1.5vw,18px)", color: "var(--charcoal)", margin: 0, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Projects & Case Studies
          </h2>
        </div>

        {/* ── Add your projects here ────────────────────────────────────────
            To add a project, copy the card below and fill in your details.
            ────────────────────────────────────────────────────────────────── */}

        {/* Empty state — shown until this category has published projects */}
        <ComingSoon />

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
