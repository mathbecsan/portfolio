"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { CategoriesGrid, DISCIPLINES, FIELDS, ProjectsGrid, TileStyles, type Discipline, type Field } from "./ExperienceGallery";
import { PlaceholderArt } from "./FeaturedProjects";

/* ── /projects ─────────────────────────────────────────────────────────
 * Hero (intro, stats, latest project) + search & discipline filters over
 * the field galleries. Filtering dims non-matching tiles instead of removing
 * them, so the collage layout never shifts.
 *
 * LATEST: point it at the project you most recently added / worked on.
 * Without `image` it shows a placeholder; without `href` the link is hidden. */

const LATEST: { title: string; summary: string; field?: string; date?: string; image?: string; href?: string } = {
  title: "Latest project",
  summary: "The newest case study will be featured here as soon as it's published.",
  field: "Coming soon",
};

// Shown in the hero stats. Update as projects are added.
const PROJECT_COUNT = "30+";

const DISCIPLINE_COLOR: Record<Discipline, string> = {
  "Engineering": "var(--bauhaus-blue)",
  "Design": "var(--bauhaus-red)",
  "Research": "var(--bauhaus-yellow)",
  "Media & Storytelling": "var(--cream)",
};

const STRIP = ["var(--bauhaus-red)", "var(--bauhaus-yellow)", "var(--bauhaus-blue)", "var(--cream)"];

export default function ProjectsExplorer() {
  const [query, setQuery] = useState("");
  const [discipline, setDiscipline] = useState<Discipline | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // ⌘K / Ctrl+K or "/" focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof Element && !!e.target.closest("input, textarea, select, [contenteditable]");
      if (((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const isMatch = useMemo(() => (f: Field) =>
    (!discipline || f.disciplines.includes(discipline)) &&
    (!q || f.label.toLowerCase().includes(q) || f.disciplines.some((d) => d.toLowerCase().includes(q))),
  [discipline, q]);
  const filtering = !!discipline || !!q;
  const shown = FIELDS.filter(isMatch).length;
  const counts = useMemo(() => Object.fromEntries(DISCIPLINES.map((d) => [d, FIELDS.filter((f) => f.disciplines.includes(d)).length])) as Record<Discipline, number>, []);

  return (
    <>
      <style>{`
        .px-hero { display: grid; grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr); gap: clamp(32px, 5vw, 80px); align-items: center; }
        @media (max-width: 900px) { .px-hero { grid-template-columns: 1fr; } }
        .px-hero .page-hero__title { font-size: clamp(56px, 9vw, 132px); }
        .px-hero .page-hero__title em { font-style: normal; color: var(--bauhaus-yellow); }
        .px-stats { display: flex; flex-wrap: wrap; gap: clamp(24px, 4vw, 56px); margin-top: clamp(28px, 4vw, 44px); }
        .px-stat b { display: block; font-family: var(--font-display); font-weight: 400; font-size: clamp(40px, 5vw, 64px); line-height: 1; color: var(--cream); }
        .px-stat span { display: flex; align-items: center; gap: 8px; margin-top: 6px; font-family: var(--font-body); font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(240,237,230,0.6); }
        .px-stat span::before { content: ""; width: 8px; height: 8px; background: var(--c); }

        .px-latest__eyebrow { display: flex; align-items: center; gap: 10px; margin: 0 0 12px; font-family: var(--font-body); font-size: 12px; font-weight: 700; letter-spacing: 0.24em; text-transform: uppercase; color: rgba(240,237,230,0.6); }
        .px-latest__eyebrow::before { content: "✦"; color: var(--bauhaus-yellow); }
        .px-latest { display: block; color: inherit; text-decoration: none; background: #161616; border: 1px solid rgba(240,237,230,0.12); border-radius: 4px; overflow: hidden; }
        .px-latest__media { aspect-ratio: 16 / 8; overflow: hidden; border-bottom: 4px solid var(--bauhaus-red); }
        .px-latest__media img, .px-latest__media svg { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
        a.px-latest:hover .px-latest__media img, a.px-latest:hover .px-latest__media svg { transform: scale(1.04); }
        .px-latest__body { padding: clamp(18px, 2.2vw, 28px); }
        .px-latest__meta { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; font-family: var(--font-body); font-size: 13px; color: rgba(240,237,230,0.6); }
        .px-latest__tag { padding: 4px 10px; background: var(--bauhaus-blue); color: #fff; font-size: 11px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; }
        .px-latest__title { font-family: var(--font-body); font-weight: 700; font-size: clamp(20px, 1.9vw, 26px); line-height: 1.25; color: var(--cream); margin: 0 0 10px; }
        .px-latest__summary { font-family: var(--font-body); font-size: 15px; line-height: 1.6; color: rgba(240,237,230,0.65); margin: 0;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .px-latest__cta { display: inline-flex; gap: 8px; margin-top: 16px; font-family: var(--font-body); font-size: 13px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: var(--bauhaus-yellow); }

        .px-tools { position: sticky; top: var(--site-nav-h); z-index: 20; background: rgba(13,13,13,0.94); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(240,237,230,0.08); padding: 16px var(--gutter); }
        .px-tools__row { display: flex; flex-wrap: wrap; align-items: center; gap: 12px 20px; }
        .px-search { position: relative; flex: 1 1 280px; max-width: 520px; }
        .px-search input {
          width: 100%; height: 44px; padding: 0 64px 0 42px; border-radius: 3px; border: 1px solid rgba(240,237,230,0.22);
          background: #161616; color: var(--cream); font-family: var(--font-body); font-size: 15px; outline: none; transition: border-color 0.2s;
        }
        .px-search input::placeholder { color: rgba(240,237,230,0.45); }
        .px-search input:focus { border-color: var(--bauhaus-yellow); }
        .px-search svg { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: rgba(240,237,230,0.5); pointer-events: none; }
        .px-search kbd { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); padding: 3px 7px; border-radius: 3px; border: 1px solid rgba(240,237,230,0.2);
          font-family: var(--font-geist-mono), monospace; font-size: 11px; color: rgba(240,237,230,0.5); }
        .px-chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .px-chip {
          display: inline-flex; align-items: center; gap: 8px; height: 36px; padding: 0 14px; border-radius: 3px; cursor: pointer;
          border: 1px solid rgba(240,237,230,0.25); background: transparent; color: rgba(240,237,230,0.8);
          font-family: var(--font-body); font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .px-chip i { width: 9px; height: 9px; background: var(--c, var(--cream)); flex-shrink: 0; }
        .px-chip small { font-size: 11px; opacity: 0.6; font-weight: 600; letter-spacing: 0.06em; }
        .px-chip:hover { border-color: var(--cream); color: var(--cream); }
        .px-chip[aria-pressed="true"] { background: var(--cream); color: var(--ink); border-color: var(--cream); }
        .px-chip:focus-visible, .px-clear:focus-visible { outline: 2px solid var(--bauhaus-yellow); outline-offset: 2px; }
        .px-status { display: flex; align-items: center; gap: 14px; margin-top: 12px; font-family: var(--font-body); font-size: 14px; color: rgba(240,237,230,0.6); }
        .px-status b { color: var(--cream); }
        .px-clear { border: 0; background: none; padding: 0; cursor: pointer; color: var(--bauhaus-yellow); font: inherit; font-weight: 700; text-decoration: underline; text-underline-offset: 3px; }
        @media (max-width: 767px) {
          .px-tools { position: static; }
          .px-chips { flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; margin: 0 calc(-1 * var(--gutter)); padding: 0 var(--gutter); }
          .px-chips::-webkit-scrollbar { display: none; }
          .px-chip { flex-shrink: 0; }
          .px-search { max-width: none; }
          .px-search kbd { display: none; }
          .px-search input { padding-right: 14px; }
        }
        .px-empty { text-align: center; padding: 18px var(--gutter) 0; font-family: var(--font-body); color: rgba(240,237,230,0.7); }
      `}</style>

      {/* ── Hero ── */}
      <header className="below-site-nav" style={{ background: "var(--ink)" }}>
        <div className="page-hero" style={{ "--accent": "var(--bauhaus-red)" } as CSSProperties}>
          <div className="px-hero">
            <div>
              <p className="page-hero__eyebrow">Portfolio</p>
              <h1 className="page-hero__title">Building <em>across</em> disciplines</h1>
              <p className="page-hero__intro">
                From concept to prototype — design, engineering, research and storytelling, organized by field.
                Filter by discipline or search, then open a field to see its work.
              </p>
              <div className="px-stats">
                <div className="px-stat" style={{ "--c": "var(--bauhaus-red)" } as CSSProperties}><b>{PROJECT_COUNT}</b><span>Projects</span></div>
                <div className="px-stat" style={{ "--c": "var(--bauhaus-blue)" } as CSSProperties}><b>{FIELDS.length}</b><span>Fields</span></div>
              </div>
            </div>

            <div>
              <p className="px-latest__eyebrow">Latest project</p>
              {(() => {
                const body = (
                  <>
                    <div className="px-latest__media">
                      {LATEST.image ? <img src={LATEST.image} alt="" /> : <PlaceholderArt n={3} />}
                    </div>
                    <div className="px-latest__body">
                      <div className="px-latest__meta">
                        {LATEST.field && <span className="px-latest__tag">{LATEST.field}</span>}
                        {LATEST.date && <span>{LATEST.date}</span>}
                      </div>
                      <h2 className="px-latest__title">{LATEST.title}</h2>
                      <p className="px-latest__summary">{LATEST.summary}</p>
                      {LATEST.href && <span className="px-latest__cta">Explore project <span aria-hidden="true">→</span></span>}
                    </div>
                  </>
                );
                return LATEST.href
                  ? <Link href={LATEST.href} className="px-latest">{body}</Link>
                  : <article className="px-latest">{body}</article>;
              })()}
            </div>
          </div>
          <div className="page-hero__strip" aria-hidden="true">
            {STRIP.map((c) => <i key={c} style={{ background: c }} />)}
          </div>
        </div>
      </header>

      {/* ── Search + filters (sticky under the nav) ── */}
      <div className="px-tools" role="search">
        <div className="px-tools__row">
          <label className="px-search">
            <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Search fields</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            <input ref={searchRef} type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search fields…" aria-describedby="px-status" />
            <kbd aria-hidden="true">⌘K</kbd>
          </label>
          <div className="px-chips" role="group" aria-label="Filter by discipline">
            <button type="button" className="px-chip" aria-pressed={!discipline} onClick={() => setDiscipline(null)}>
              All <small>{FIELDS.length}</small>
            </button>
            {DISCIPLINES.map((d) => (
              <button key={d} type="button" className="px-chip" aria-pressed={discipline === d}
                style={{ "--c": DISCIPLINE_COLOR[d] } as CSSProperties}
                onClick={() => setDiscipline(discipline === d ? null : d)}>
                <i aria-hidden="true" />{d} <small>{counts[d]}</small>
              </button>
            ))}
          </div>
        </div>
        <p id="px-status" className="px-status" aria-live="polite">
          <span>Showing <b>{shown}</b> of <b>{FIELDS.length}</b> fields</span>
          {filtering && <button type="button" className="px-clear" onClick={() => { setQuery(""); setDiscipline(null); }}>Clear filters</button>}
        </p>
      </div>

      {filtering && shown === 0 && <p className="px-empty">No fields match “{query}”{discipline ? ` in ${discipline}` : ""}.</p>}

      {/* ── Field galleries ── */}
      <TileStyles />
      <ProjectsGrid isMatch={filtering ? isMatch : undefined} />
      <CategoriesGrid isMatch={filtering ? isMatch : undefined} style={{ paddingTop: 3 }} />
    </>
  );
}
