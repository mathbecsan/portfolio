import Link from "next/link";
import type { CSSProperties } from "react";

/* ── Site-wide navigation ───────────────────────────────────────────────
 * One nav for every page, styled in globals.css (.site-nav*).
 *   variant="hero" → homepage hero (large logo, sits in the hero layout)
 *   variant="bar"  → fixed top bar on every other page (default)
 * Pages using the bar wrap their content in `.below-site-nav` (or use
 * <PageHero />, which already does) so nothing hides under it. */

export const SITE_LINKS = [
  { label: "Experience",         href: "/experience", cta: true },
  { label: "Projects",           href: "/projects" },
  { label: "Interactive Studio", href: "/playground" },
  { label: "Blog",               href: "/blog" },
  { label: "News",               href: "/news" },
  { label: "Contact",            href: "/contact" },
] as const;

export type SiteSection = (typeof SITE_LINKS)[number]["label"];

/* Page transitions are directional, following the tab order (Home → … → Contact):
 * a tab to the right slides content in from the right ("nav-forward"); a tab to the
 * left, or the logo, slides it back ("nav-back"). See globals.css › Page transitions. */
const HOME_INDEX = -1;
const indexOf = (s?: SiteSection) => (s ? SITE_LINKS.findIndex((l) => l.label === s) : HOME_INDEX);
const direction = (from: number, to: number) => (to > from ? ["nav-forward"] : to < from ? ["nav-back"] : undefined);

export default function SiteNav({ current, variant = "bar" }: { current?: SiteSection; variant?: "bar" | "hero" }) {
  const here = indexOf(current);
  const onHome = variant === "hero";
  return (
    // The nav keeps its place during page transitions (view-transition-name: site-nav).
    <nav className={`site-nav site-nav--${variant}`} aria-label="Main" style={{ viewTransitionName: "site-nav" }}>
      <Link
        href={onHome ? "#home" : "/"}
        className="site-nav__logo"
        aria-label={onHome ? "MATHBECSAN" : "MATHBECSAN — back to home"}
        title={onHome ? undefined : "Back to home"}
        transitionTypes={onHome ? undefined : direction(here, HOME_INDEX)}
      >
        {/* Hero uses the full artwork; the bar uses a tightly cropped wordmark so it stays legible at bar height. */}
        <img src={onHome ? "/brand-logo.webp" : "/brand-logo-wordmark.webp"} alt="MATHBECSAN" />
        {!onHome && <span className="site-nav__home" aria-hidden="true">← Home</span>}
      </Link>
      <div className="site-nav__links">
        {SITE_LINKS.map((l, i) => {
          const isCta = "cta" in l && l.cta;
          const active = l.label === current;
          return (
            <Link
              key={l.label}
              href={l.href}
              className={isCta ? "site-nav__cta" : "site-nav__link"}
              aria-current={active ? "page" : undefined}
              transitionTypes={direction(here, i)}
            >
              {isCta ? `${l.label} ✦` : l.label}
              {/* One indicator, shared across pages, so it glides from the old tab to the new one. */}
              {active && <span className="site-nav__ind" aria-hidden="true" style={{ viewTransitionName: "nav-indicator" }} />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* ── Page header ────────────────────────────────────────────────────────
 * Standard header for inner pages: dark grid background (same as the
 * homepage hero), small eyebrow, display title, one-line intro, and a
 * Bauhaus colour strip. `accent` tints the eyebrow marker. */

const STRIP = ["var(--bauhaus-red)", "var(--bauhaus-yellow)", "var(--bauhaus-blue)", "var(--cream)"];

export type Crumb = { label: string; href?: string };

/* Breadcrumb trail. The last item is the current page. */
export function Breadcrumbs({ items, bar = false }: { items: Crumb[]; bar?: boolean }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className={bar ? "crumbs crumbs--bar" : "crumbs"}>
        {items.map((c, i) => (
          <li key={c.label}>
            {c.href && i < items.length - 1
              ? <Link href={c.href}>{c.label}</Link>
              : <span aria-current="page">{c.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHero({ eyebrow, title, intro, accent = "var(--bauhaus-red)", crumbs }: {
  eyebrow: string; title: string; intro: string; accent?: string; crumbs?: Crumb[];
}) {
  return (
    <header className="below-site-nav" style={{ background: "var(--ink)" }}>
      <div className="page-hero" style={{ "--accent": accent } as CSSProperties}>
        {crumbs && <Breadcrumbs items={crumbs} />}
        <p className="page-hero__eyebrow">{eyebrow}</p>
        <h1 className="page-hero__title">{title}</h1>
        <p className="page-hero__intro">{intro}</p>
        <div className="page-hero__strip" aria-hidden="true">
          {STRIP.map((c) => <i key={c} style={{ background: c }} />)}
        </div>
      </div>
    </header>
  );
}
