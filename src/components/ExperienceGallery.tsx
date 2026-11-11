"use client";
import { useEffect, useRef, type CSSProperties } from "react";

/* Shared Experience gallery grids — used on the homepage and on /experience.
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

type TileProps = {
  src: string; alt: string; label: string; href?: string;
  isVideo?: boolean; poster?: string; style?: CSSProperties;
};

function Tile({ src, alt, label, isVideo = false, poster, href, style = {} }: TileProps) {
  const inner = (
    <>
      {isVideo
        ? <LazyVideo src={src} poster={poster} />
        : <img src={src} alt={alt} loading="lazy" decoding="async"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      }
      <div className="tile-overlay">
        <span className="tile-label">{label}</span>
      </div>
    </>
  );
  const base: CSSProperties = { position: "relative", overflow: "hidden", display: "block", ...style };
  return href
    ? <a href={href} aria-label={label} style={{ ...base, textDecoration: "none", cursor: "pointer" }}>{inner}</a>
    : <div style={base}>{inner}</div>;
}

const TILE_CSS = `
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

/** Image 5 — 3×3 dark gallery (Music Production, Human-Robot Interaction, Photography, …). */
export function CategoriesGrid({ style }: { style?: CSSProperties }) {
  return (
    <div style={{ width: "100%", background: "#000", padding: "clamp(12px, 2vw, 24px)", ...style }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "30vh 30vh 30vh", gap: "3px" }}>
        <Tile src="/experience-screen3/musicproduction.mp4" poster="/experience-screen3/musicproduction-poster.jpg" isVideo alt="Music Production" label="Music Production" href="/experience/music-production" style={{ gridColumn: "1", gridRow: "1" }} />
        <Tile src="/experience-screen3/hri-7eff3147.webp" alt="Human-Robot Interaction" label="Human-Robot Interaction" href="/experience/human-robot-interaction" style={{ gridColumn: "2", gridRow: "1 / 3" }} />
        <Tile src="/experience-screen3/data-visualization-fb352c8b.mp4" poster="/experience-screen3/data-visualization-poster-298ad945.jpg" isVideo alt="Data Visualization" label="Data Visualization" href="/experience/data-visualization" style={{ gridColumn: "3", gridRow: "1" }} />
        <Tile src="/experience-screen3/digital-fabrication-0070749c.webp" alt="Digital Fabrication" label="Digital Fabrication" href="/experience/digital-fabrication" style={{ gridColumn: "1", gridRow: "2" }} />
        <Tile src="/experience-screen3/photography-5abf5689.webp" alt="Photography" label="Photography" href="/experience/photography" style={{ gridColumn: "3", gridRow: "2" }} />
        <Tile src="/experience-screen3/xr-d4098b87.webp" alt="Immersive Technologies" label="Immersive Technologies" href="/experience/immersive-technologies" style={{ gridColumn: "1", gridRow: "3" }} />
        <Tile src="/experience-screen3/visual-arts-crafting-6b251eff.webp" alt="Visual Arts & Crafting" label="Visual Arts & Crafting" href="/experience/visual-arts-crafting" style={{ gridColumn: "2", gridRow: "3" }} />
        <Tile src="/experience-screen4/community-education-ced63005.webp" alt="Community-Centered Education Prototypes" label="Community-Centered Education Prototypes" href="/experience/community-education" style={{ gridColumn: "3", gridRow: "3" }} />
      </div>
    </div>
  );
}

/** Image 4 — 4×3 projects gallery (Logo Story, Physical and Digital Animation, App Development, …). */
export function ProjectsGrid({ style }: { style?: CSSProperties }) {
  return (
    <div style={{ width: "100%", background: "#000", padding: "clamp(12px, 2vw, 24px)", ...style }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gridTemplateRows: "28vh 28vh 28vh", gap: "3px" }}>
        <Tile src="/experience-screen4/logostory.mp4" poster="/experience-screen4/logostory-poster.jpg" isVideo alt="MATHBECSAN" label="Logo Story" href="/experience/logo-story" style={{ gridColumn: "1 / 3", gridRow: "1" }} />
        <Tile src="/experience-screen4/physical-digital-animation-99397d83.webp" alt="Physical and Digital Animation" label="Physical and Digital Animation" href="/experience/physical-digital-animation" style={{ gridColumn: "3", gridRow: "1" }} />
        <Tile src="/experience-screen4/game-development-761817d4.webp" alt="Game Development" label="Game Development" href="/experience/game-development" style={{ gridColumn: "4", gridRow: "1" }} />
        <Tile src="/experience-screen4/app-development.svg" alt="App Development" label="App Development" href="/experience/app-development" style={{ gridColumn: "1", gridRow: "2 / 4" }} />
        <Tile src="/experience-screen4/filmmaking-72c87e3a.mp4" poster="/experience-screen4/filmmaking-poster-c21852e9.jpg" isVideo alt="Filmmaking" label="Filmmaking" href="/experience/filmmaking" style={{ gridColumn: "2", gridRow: "2" }} />
        <Tile src="/experience-screen4/web-development-fdd1f636.webp" alt="Web Development" label="Web Development" href="/experience/web-development" style={{ gridColumn: "3", gridRow: "2 / 4" }} />
        <Tile src="/experience-screen4/electronics-4ddf0a91.webp" alt="Physical Computing & Hardware" label="Physical Computing & Hardware" href="/experience/physical-computing-hardware" style={{ gridColumn: "4", gridRow: "2" }} />
        <Tile src="/experience-screen4/research.svg" alt="AI Governance Research" label="AI Governance Research" href="/experience/ai-governance-research" style={{ gridColumn: "2", gridRow: "3" }} />
        <Tile src="/experience-screen3/uxui.svg" alt="UX/UI" label="UX/UI Implementation" href="/experience/uxui" style={{ gridColumn: "4", gridRow: "3" }} />
      </div>
    </div>
  );
}
