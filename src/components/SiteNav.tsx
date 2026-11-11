"use client";
import Link from "next/link";

/* Site-wide navigation. The homepage renders SITE_LINKS in its own dark hero nav;
 * every other page uses <SiteNav />. */

export const SITE_LINKS = [
  { label: "Experience",         href: "/experience" },
  { label: "Projects",           href: "/projects" },
  { label: "Interactive Studio", href: "/playground" },
  { label: "Blog",               href: "/blog" },
  { label: "News",               href: "/news" },
  { label: "Contact",            href: "/#contact" },
] as const;

export default function SiteNav({ current }: { current?: (typeof SITE_LINKS)[number]["label"] }) {
  return (
    <nav className="site-nav">
      <style>{`
        .site-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 50;
          display: flex; align-items: center; justify-content: space-between; gap: 24px;
          padding: 14px clamp(16px, 3vw, 40px);
          background: rgba(255,243,222,0.92);
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          border-bottom: 1.5px solid rgba(31,41,55,0.08);
        }
        .site-nav__links {
          display: flex; align-items: center; gap: clamp(14px, 2vw, 28px);
          overflow-x: auto; scrollbar-width: none; -webkit-overflow-scrolling: touch;
        }
        .site-nav__links::-webkit-scrollbar { display: none; }
        .site-nav__link {
          flex-shrink: 0; white-space: nowrap;
          font-family: monospace; font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase;
          color: rgba(31,41,55,0.6); text-decoration: none;
          padding: 4px 0; border-bottom: 2px solid transparent;
          transition: color 0.2s, border-color 0.2s;
        }
        .site-nav__link:hover { color: #1F2937; border-bottom-color: #E63329; }
        .site-nav__link[aria-current="page"] { color: #1F2937; font-weight: 700; border-bottom-color: #1F2937; }
      `}</style>
      <Link href="/" aria-label="Home" style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
        <img src="/experience-screen1/mathbecsanbrandnewlogo.svg" alt="MATHBECSAN" style={{ height: 26, width: "auto", display: "block" }} />
      </Link>
      <div className="site-nav__links">
        {SITE_LINKS.map((l) => (
          <Link key={l.label} href={l.href} className="site-nav__link" aria-current={l.label === current ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

/* Shared hero band for the simple top-level pages (Projects, Studio, Blog, News). */
export function PageHero({ eyebrow, title, intro, accent = "#E63329" }: {
  eyebrow: string; title: string; intro: string; accent?: string;
}) {
  // Light accents (yellow) need dark text for contrast.
  const dark = accent.toUpperCase() === "#FBBF24";
  const ink = dark ? "#1F2937" : "#fff";
  return (
    <div style={{ paddingTop: 58 }}>
      <div style={{ background: accent, padding: "clamp(48px,7vw,96px) clamp(24px,6vw,80px)" }}>
        <p style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.22em", color: ink, opacity: 0.65, textTransform: "uppercase", margin: "0 0 12px" }}>
          {eyebrow}
        </p>
        <h1 style={{
          fontFamily: "monospace", fontWeight: 900, fontSize: "clamp(40px,8vw,100px)",
          color: ink, margin: "0 0 16px", lineHeight: 0.95, textTransform: "uppercase", letterSpacing: "-0.02em",
        }}>{title}</h1>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(14px,1.4vw,18px)", color: ink, opacity: 0.85, margin: 0, maxWidth: 560, lineHeight: 1.65 }}>
          {intro}
        </p>
      </div>
    </div>
  );
}
