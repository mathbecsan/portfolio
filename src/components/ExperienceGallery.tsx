"use client";
import { useEffect, useRef, type CSSProperties } from "react";

/* Project-field gallery grids — used on /projects.
 *
 * Performance notes:
 *  - Images are lazy-loaded and decoded off the main thread.
 *  - Videos don't download anything until they're near the viewport, show a
 *    lightweight poster first, and pause again when scrolled out of view.
 */

function LazyVideo({ src, poster }: { src: string; poster?: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!el.src) { el.src = src; el.load(); }
          el.play().catch(() => {});
        } else if (el.src) {
          el.pause();
        }
      },
      { rootMargin: "300px 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
    />
  );
}

/* ── Fields ─────────────────────────────────────────────────────────────
 * Every project field, in one list. `grid` says which gallery it sits in and
 * where; `disciplines` drive the filters on /projects (a field can be in
 * more than one). Edit here to rename, re-image, re-place or re-tag a field. */

export const DISCIPLINES = ["Engineering", "Design", "Research", "Media & Storytelling"] as const;
export type Discipline = (typeof DISCIPLINES)[number];

export type Field = {
  slug: string; label: string;
  src: string; poster?: string; isVideo?: boolean;
  grid: "projects" | "categories"; col: string; row: string;
  disciplines: Discipline[];
};

const S3 = "/experience-screen3", S4 = "/experience-screen4";

export const FIELDS: Field[] = [
  // 4×3 "projects" gallery
  { slug: "personal-artifacts", label: "Personal Artifacts", src: `${S4}/logostory.mp4`, poster: `${S4}/logostory-poster.jpg`, isVideo: true, grid: "projects", col: "1 / 3", row: "1", disciplines: ["Design", "Media & Storytelling"] },
  { slug: "physical-digital-animation", label: "Physical and Digital Animation", src: `${S4}/physical-digital-animation-99397d83.webp`, grid: "projects", col: "3", row: "1", disciplines: ["Media & Storytelling", "Design"] },
  { slug: "game-development", label: "Game Development", src: `${S4}/game-development-761817d4.webp`, grid: "projects", col: "4", row: "1", disciplines: ["Engineering", "Design"] },
  { slug: "app-development", label: "App Development", src: `${S4}/app-development.svg`, grid: "projects", col: "1", row: "2 / 4", disciplines: ["Engineering"] },
  { slug: "filmmaking", label: "Filmmaking", src: `${S4}/filmmaking-72c87e3a.mp4`, poster: `${S4}/filmmaking-poster-c21852e9.jpg`, isVideo: true, grid: "projects", col: "2", row: "2", disciplines: ["Media & Storytelling"] },
  { slug: "web-development", label: "Web Development", src: `${S4}/web-development-fdd1f636.webp`, grid: "projects", col: "3", row: "2 / 4", disciplines: ["Engineering"] },
  { slug: "physical-computing-hardware", label: "Physical Computing & Hardware", src: `${S4}/electronics-4ddf0a91.webp`, grid: "projects", col: "4", row: "2", disciplines: ["Engineering"] },
  { slug: "ai-governance-research", label: "AI Governance Research", src: `${S4}/research.svg`, grid: "projects", col: "2", row: "3", disciplines: ["Research"] },
  { slug: "uxui", label: "UX/UI Implementation", src: `${S3}/uxui.svg`, grid: "projects", col: "4", row: "3", disciplines: ["Design", "Engineering"] },
  // 3×3 "categories" gallery
  { slug: "music-production", label: "Music Production", src: `${S3}/musicproduction.mp4`, poster: `${S3}/musicproduction-poster.jpg`, isVideo: true, grid: "categories", col: "1", row: "1", disciplines: ["Media & Storytelling"] },
  { slug: "human-robot-interaction", label: "Human-Robot Interaction", src: `${S3}/hri-7eff3147.webp`, grid: "categories", col: "2", row: "1 / 3", disciplines: ["Research", "Engineering"] },
  { slug: "data-visualization", label: "Data Visualization", src: `${S3}/data-visualization-fb352c8b.mp4`, poster: `${S3}/data-visualization-poster-298ad945.jpg`, isVideo: true, grid: "categories", col: "3", row: "1", disciplines: ["Design", "Research"] },
  { slug: "digital-fabrication", label: "Digital Fabrication", src: `${S3}/digital-fabrication-0070749c.webp`, grid: "categories", col: "1", row: "2", disciplines: ["Engineering", "Design"] },
  { slug: "photography", label: "Photography", src: `${S3}/photography-5abf5689.webp`, grid: "categories", col: "3", row: "2", disciplines: ["Media & Storytelling"] },
  { slug: "immersive-technologies", label: "Immersive Technologies", src: `${S3}/xr-d4098b87.webp`, grid: "categories", col: "1", row: "3", disciplines: ["Engineering", "Design"] },
  { slug: "visual-arts-crafting", label: "Visual Arts & Crafting", src: `${S3}/visual-arts-crafting-6b251eff.webp`, grid: "categories", col: "2", row: "3", disciplines: ["Design", "Media & Storytelling"] },
  { slug: "community-education", label: "Community-Centered Education Prototypes", src: `${S4}/community-education-ced63005.webp`, grid: "categories", col: "3", row: "3", disciplines: ["Research", "Design"] },
];

function Tile({ field, dim = false }: { field: Field; dim?: boolean }) {
  const { src, label, isVideo, poster, slug, col, row } = field;
  return (
    <a
      href={`/experience/${slug}`}
      aria-label={label}
      className="tile"
      data-dim={dim || undefined}
      style={{ position: "relative", overflow: "hidden", display: "block", textDecoration: "none", cursor: "pointer", gridColumn: col, gridRow: row }}
    >
      {isVideo
        ? <LazyVideo src={src} poster={poster} />
        : <img src={src} alt={label} loading="lazy" decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      }
      <div className="tile-overlay">
        <span className="tile-label">{label}</span>
      </div>
    </a>
  );
}

const TILE_CSS = `
  .tile { transition: opacity 0.35s ease, filter 0.35s ease; }
  .tile[data-dim] { opacity: 0.16; filter: grayscale(1); }
  .tile-overlay {
    position: absolute; inset: 0;
    background: rgba(0,0,0,0);
    backdrop-filter: blur(0px);
    display: flex; align-items: center; justify-content: center;
    transition: background 0.3s ease, backdrop-filter 0.3s ease;
  }
  .tile-overlay:hover { background: rgba(0,0,0,0.45); backdrop-filter: blur(6px); }
  .tile-label {
    opacity: 0; color: #fff; font-family: monospace; font-weight: 900;
    font-size: clamp(13px, 1.6vw, 22px); letter-spacing: 0.14em; line-height: 1.35; text-transform: uppercase;
    text-align: center; text-wrap: balance; max-width: 100%; padding: 0 clamp(12px, 2vw, 28px);
    transition: opacity 0.3s ease;
  }
  .tile-overlay:hover .tile-label { opacity: 1; }
`;

export function TileStyles() {
  return <style>{TILE_CSS}</style>;
}

type GridProps = { style?: CSSProperties; isMatch?: (f: Field) => boolean };

function Gallery({ which, cols, rows, style, isMatch }: GridProps & { which: Field["grid"]; cols: string; rows: string }) {
  return (
    <div style={{ width: "100%", background: "#000", padding: "clamp(12px, 2vw, 24px)", ...style }}>
      <div style={{ display: "grid", gridTemplateColumns: cols, gridTemplateRows: rows, gap: "3px" }}>
        {FIELDS.filter((f) => f.grid === which).map((f) => (
          <Tile key={f.slug} field={f} dim={isMatch ? !isMatch(f) : false} />
        ))}
      </div>
    </div>
  );
}

/** 4×3 gallery (Personal Artifacts, Physical and Digital Animation, App Development, …). */
export function ProjectsGrid(props: GridProps) {
  return <Gallery which="projects" cols="1fr 1fr 1fr 1fr" rows="28vh 28vh 28vh" {...props} />;
}

/** 3×3 gallery (Music Production, Human-Robot Interaction, Photography, …). */
export function CategoriesGrid(props: GridProps) {
  return <Gallery which="categories" cols="1fr 1fr 1fr" rows="30vh 30vh 30vh" {...props} />;
}
