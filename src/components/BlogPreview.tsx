import Link from "next/link";

/* ── Homepage "From the blog" ──────────────────────────────────────────
 * The 3 most recent posts, plus a button to /blog.
 *
 * To show a real post, fill in its entry:
 *   { date: "Sep 2025", title: "From Classroom to Startup Floor",
 *     excerpt: "One or two sentences…", image: "/blog/<slug>-<hash>.webp",
 *     href: "/blog/<slug>" }
 * Entries without `image` show a placeholder; without `href` they aren't clickable. */

type Post = { date: string; title: string; excerpt: string; image?: string; href?: string };

export const RECENT_POSTS: Post[] = [
  { date: "Coming soon", title: "Blog post title", excerpt: "A short teaser for the first post will appear here." },
  { date: "Coming soon", title: "Blog post title", excerpt: "A short teaser for the second post will appear here." },
  { date: "Coming soon", title: "Blog post title", excerpt: "A short teaser for the third post will appear here." },
];

const R = "var(--bauhaus-red)", Y = "var(--bauhaus-yellow)", B = "var(--bauhaus-blue)", C = "#FAF8F3", K = "var(--charcoal)";

/* Three "editorial" placeholders (page, pen, speech) — distinct from the project art. */
function PostArt({ n }: { n: number }) {
  const arts = [
    // page with text lines
    <><rect width="400" height="300" fill={Y} /><rect x="120" y="40" width="160" height="220" fill={C} stroke={K} strokeWidth="4" />
      <rect x="145" y="75" width="90" height="12" fill={R} />{[110, 135, 160, 185, 210].map((y) => <rect key={y} x="145" y={y} width={y === 210 ? 70 : 110} height="6" fill={K} />)}</>,
    // pen nib over a circle
    <><rect width="400" height="300" fill={C} /><circle cx="200" cy="150" r="105" fill={B} />
      <polygon points="200,60 245,170 200,235 155,170" fill={C} stroke={K} strokeWidth="4" /><circle cx="200" cy="165" r="10" fill={K} /><rect x="198" y="175" width="4" height="58" fill={K} /></>,
    // speech bubble
    <><rect width="400" height="300" fill={R} /><rect x="80" y="60" width="240" height="140" rx="22" fill={C} stroke={K} strokeWidth="4" />
      <polygon points="140,198 175,198 130,245" fill={C} stroke={K} strokeWidth="4" strokeLinejoin="round" /><rect x="132" y="195" width="46" height="8" fill={C} />
      <circle cx="160" cy="130" r="12" fill={K} /><circle cx="200" cy="130" r="12" fill={Y} /><circle cx="240" cy="130" r="12" fill={B} /></>,
  ];
  return (
    <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {arts[n % arts.length]}
    </svg>
  );
}

export default function BlogPreview() {
  return (
    <section id="blog" className="blogp" aria-labelledby="blogp-title">
      <style>{`
        .blogp { background: #F0EDE6; color: var(--charcoal); padding: clamp(64px, 9vw, 128px) var(--gutter); }
        .blogp__inner { max-width: 1280px; margin: 0 auto; }
        .blogp__title {
          font-family: var(--font-display); font-weight: 400; letter-spacing: 0.04em; text-transform: uppercase;
          font-size: clamp(40px, 6vw, 80px); line-height: 0.95; color: var(--ink); margin: 0 0 10px;
        }
        .blogp__intro { font-family: var(--font-body); font-size: clamp(14px, 1.3vw, 18px); color: rgba(31,41,55,0.65); margin: 0 0 clamp(32px, 4vw, 56px); }
        .blogp__grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: clamp(28px, 3vw, 44px) clamp(20px, 2.5vw, 36px); }
        @media (max-width: 1023px) { .blogp__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 639px)  { .blogp__grid { grid-template-columns: 1fr; } }

        .bcard { display: block; color: inherit; text-decoration: none; }
        .bcard__media { aspect-ratio: 4 / 3; overflow: hidden; border-radius: 4px; border: 1px solid rgba(31,41,55,0.14); background: #fff; }
        .bcard__media img, .bcard__media svg { width: 100%; height: 100%; object-fit: cover; display: block; transition: transform 0.5s cubic-bezier(0.22,1,0.36,1); }
        a.bcard:hover .bcard__media img, a.bcard:hover .bcard__media svg { transform: scale(1.04); }
        .bcard__date { font-family: var(--font-geist-mono), ui-monospace, monospace; font-size: 14px; letter-spacing: 0.08em; color: rgba(31,41,55,0.6); margin: 18px 0 10px; }
        .bcard__title { font-family: var(--font-body); font-weight: 700; font-size: clamp(20px, 1.8vw, 26px); line-height: 1.25; color: var(--ink); margin: 0 0 12px; }
        a.bcard:hover .bcard__title { text-decoration: underline; text-decoration-color: var(--bauhaus-red); text-underline-offset: 4px; }
        .bcard__excerpt {
          font-family: var(--font-body); font-size: 16px; line-height: 1.6; color: rgba(31,41,55,0.72); margin: 0;
          display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;
        }
        .blogp__more {
          display: inline-flex; align-items: center; gap: 10px; margin-top: clamp(40px, 5vw, 64px);
          padding: 12px 22px; border: 1px solid rgba(13,13,13,0.45); border-radius: 3px;
          font-family: var(--font-body); font-size: 13px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase;
          color: var(--ink); text-decoration: none; transition: background 0.2s, color 0.2s, border-color 0.2s;
        }
        .blogp__more:hover { background: var(--ink); color: var(--cream); border-color: var(--ink); }
        .blogp__more span { transition: transform 0.2s; }
        .blogp__more:hover span { transform: translateX(4px); }
      `}</style>

      <div className="blogp__inner">
        <h2 id="blogp-title" className="blogp__title">From the blog</h2>
        <p className="blogp__intro">Notes on design, research, and the stories behind the work.</p>

        <div className="blogp__grid">
          {RECENT_POSTS.slice(0, 3).map((p, i) => {
            const body = (
              <>
                <div className="bcard__media">
                  {p.image ? <img src={p.image} alt="" loading="lazy" decoding="async" /> : <PostArt n={i} />}
                </div>
                <p className="bcard__date">{p.date}</p>
                <h3 className="bcard__title">{p.title}</h3>
                <p className="bcard__excerpt">{p.excerpt}</p>
              </>
            );
            return p.href
              ? <Link key={i} href={p.href} className="bcard">{body}</Link>
              : <article key={i} className="bcard">{body}</article>;
          })}
        </div>

        <Link href="/blog" className="blogp__more">All posts <span aria-hidden="true">→</span></Link>
      </div>
    </section>
  );
}
