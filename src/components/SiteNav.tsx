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

export default function SiteNav({ current, variant = "bar" }: { current?: SiteSection; variant?: "bar" | "hero" }) {
  return (
    <nav className={`site-nav site-nav--${variant}`} aria-label="Main">
      <Link href={variant === "hero" ? "#home" : "/"} className="site-nav__logo" aria-label="MATHBECSAN — home">
        {/* Hero uses the full artwork; the bar uses a tightly cropped wordmark so it stays legible at bar height. */}
        <img src={variant === "hero" ? "/brand-logo.webp" : "/brand-logo-wordmark.webp"} alt="MATHBECSAN" />
      </Link>
      <div className="site-nav__links">
        {SITE_LINKS.map((l) => {
          const isCta = "cta" in l && l.cta;
          return (
            <Link
              key={l.label}
              href={l.href}
              className={isCta ? "site-nav__cta" : "site-nav__link"}
              aria-current={l.label === current ? "page" : undefined}
            >
              {isCta ? `${l.label} ✦` : l.label}
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
