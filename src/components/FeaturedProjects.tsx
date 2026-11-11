import Link from "next/link";

/* ── Featured projects (homepage "Selected Work") ──────────────────────
 * Up to 6 of the most relevant projects, plus a button to /projects.
 *
 * To feature a real project, fill in its entry:
 *   { title: "StepDrop", summary: "One or two sentences…",
 *     image: "/projects/stepdrop-<hash>.webp", href: "/experience/research" }
 * Entries without `image` show a Bauhaus placeholder; entries without
 * `href` aren't clickable. */

type Featured = { title: string; summary: string; image?: string; href?: string; tag?: string };

export const FEATURED: Featured[] = [
  { title: "Featured project 01", summary: "Case study in progress — details coming soon.", tag: "Coming soon" },
  { title: "Featured project 02", summary: "Case study in progress — details coming soon.", tag: "Coming soon" },
  { title: "Featured project 03", summary: "Case study in progress — details coming soon.", tag: "Coming soon" },
  { title: "Featured project 04", summary: "Case study in progress — details coming soon.", tag: "Coming soon" },
  { title: "Featured project 05", summary: "Case study in progress — details coming soon.", tag: "Coming soon" },
  { title: "Featured project 06", summary: "Case study in progress — details coming soon.", tag: "Coming soon" },
];

const R = "var(--bauhaus-red)", Y = "var(--bauhaus-yellow)", B = "var(--bauhaus-blue)", C = "var(--cream)", K = "var(--ink)";

/* Six simple compositions so placeholders read as a set, not copies. */
function PlaceholderArt({ n }: { n: number }) {
  const arts = [
    <><rect width="400" height="300" fill={C} /><circle cx="150" cy="150" r="90" fill={R} /><rect x="230" y="60" width="110" height="110" fill={B} /><rect x="230" y="190" width="110" height="20" fill={K} /></>,
    <><rect width="400" height="300" fill={K} /><path d="M80 260a120 120 0 0 1 240 0z" fill={Y} /><circle cx="300" cy="80" r="34" fill={R} /><rect x="60" y="50" width="12" height="120" fill={C} /><rect x="84" y="50" width="12" height="120" fill={C} /></>,
    <><rect width="400" height="300" fill={B} /><polygon points="200,40 330,260 70,260" fill={C} /><circle cx="200" cy="190" r="40" fill={R} /><rect x="0" y="270" width="400" height="30" fill={Y} /></>,
    <><rect width="400" height="300" fill={C} /><rect x="40" y="40" width="150" height="220" fill={Y} /><rect x="210" y="40" width="150" height="100" fill={K} /><circle cx="285" cy="205" r="55" fill={B} /></>,
    <><rect width="400" height="300" fill={R} /><circle cx="200" cy="150" r="100" fill={K} /><circle cx="200" cy="150" r="55" fill={C} /><rect x="320" y="30" width="50" height="50" fill={Y} /></>,
    <><rect width="400" height="300" fill={K} /><rect x="50" y="70" width="300" height="40" fill={R} /><rect x="50" y="130" width="200" height="40" fill={Y} /><rect x="50" y="190" width="250" height="40" fill={B} /><circle cx="330" cy="200" r="22" fill={C} /></>,
  ];
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {arts[n % arts.length]}
    </svg>
  );
}

export default function FeaturedProjects() {
  return (
    <section id="work" className="featured" aria-labelledby="featured-title">
      <style>{`
        .featured { background: #141414; padding: clamp(64px, 9vw, 128px) var(--gutter); scroll-margin-top: 0; }
        .featured__inner { max-width: 1280px; margin: 0 auto; }
        .featured__title {
          font-family: var(--font-display); font-weight: 400; letter-spacing: 0.04em; text-transform: uppercase;
          font-size: clamp(40px, 6vw, 80px); line-height: 0.95; color: var(--cream); margin: 0 0 10px;
        }
        .featured__intro { font-family: var(--font-body); font-size: clamp(14px, 1.3vw, 18px); color: rgba(240,237,230,0.65); margin: 0 0 clamp(32px, 4vw, 56px); }
        .featured__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(28px, 3vw, 44px) clamp(20px, 2.5vw, 36px); }
        @media (max-width: 1023px) { .featured__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 639px)  { .featured__grid { grid-template-columns: 1fr; } }

        .fcard { display: block; color: inherit; text-decoration: none; }
        .fcard__media {
          position: relative; aspect-ratio: 4 / 3; overflow: hidden; border-radius: 4px;
          border: 1px solid rgba(240,237,230,0.12); background: #1d1d1d;
        }
        .fcard__media img, .fcard__media svg { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
        a.fcard:hover .fcard__media img, a.fcard:hover .fcard__media svg { transform: scale(1.04); }
        .fcard__tag {
          position: absolute; left: 12px; top: 12px; padding: 4px 10px; border-radius: 2px;
          background: rgba(13,13,13,0.82); color: var(--cream);
          font-family: var(--font-body); font-size: 11px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
        }
        .fcard__title { font-family: var(--font-body); font-weight: 700; font-size: clamp(19px, 1.7vw, 24px); line-height: 1.2; color: var(--cream); margin: 16px 0 8px; }
        a.fcard:hover .fcard__title { text-decoration: underline; text-decoration-color: var(--bauhaus-red); text-underline-offset: 4px; }
        .fcard__summary {
          font-family: var(--font-body); font-size: 15px; line-height: 1.55; color: rgba(240,237,230,0.62); margin: 0;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .featured__more {
          display: inline-flex; align-items: center; gap: 10px; margin-top: clamp(40px, 5vw, 64px);
          padding: 12px 22px; border: 1px solid rgba(240,237,230,0.4); border-radius: 3px;
          font-family: var(--font-body); font-size: 13px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--cream); text-decoration: none; transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .featured__more:hover { background: var(--cream); color: var(--ink); border-color: var(--cream); }
        .featured__more span { transition: transform 0.2s; }
        .featured__more:hover span { transform: translateX(4px); }
      `}</style>

      <div className="featured__inner">
        <h2 id="featured-title" className="featured__title">Selected Work</h2>
        <p className="featured__intro">A few of the projects I&apos;m most proud of.</p>

        <div className="featured__grid">
          {FEATURED.slice(0, 6).map((p, i) => {
            const body = (
              <>
                <div className="fcard__media">
                  {p.image
                    ? <img src={p.image} alt="" loading="lazy" decoding="async" />
                    : <PlaceholderArt n={i} />}
                  {p.tag && <span className="fcard__tag">{p.tag}</span>}
                </div>
                <h3 className="fcard__title">{p.title}</h3>
                <p className="fcard__summary">{p.summary}</p>
              </>
            );
            return p.href
              ? <Link key={i} href={p.href} className="fcard">{body}</Link>
              : <div key={i} className="fcard">{body}</div>;
          })}
        </div>

        <Link href="/projects" className="featured__more">All projects <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
