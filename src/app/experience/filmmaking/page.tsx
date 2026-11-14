import type { Metadata } from "next";
import Link from "next/link";
import SiteNav, { Breadcrumbs } from "@/components/SiteNav";
import { FILMS, getFilm } from "./films";
import { MosaicTile } from "./FilmMedia";
import styles from "./film.module.css";

export const metadata: Metadata = {
  title: "Filmmaking — Mathias Becerra",
  description: "Short films by Mathias Becerra: Overthinking and Playback, made in Stanford's Arts Intensive Program.",
};

/* Mosaic layout: each row pairs two tiles at staggered heights, alternating
 * films, in the spirit of a director's reel. `scene` indexes film.scenes;
 * no `scene` means the film's main loop. `col` is the 12-column grid span. */
const TILES: { film: string; scene?: number; col: string; drop?: boolean }[] = [
  { film: "overthinking", col: "1 / 9" },
  { film: "playback", scene: 0, col: "9 / 13", drop: true },
  { film: "overthinking", scene: 0, col: "1 / 5", drop: true },
  { film: "playback", col: "5 / 13" },
  { film: "playback", scene: 1, col: "2 / 6" },
  { film: "overthinking", scene: 1, col: "7 / 12", drop: true },
  { film: "overthinking", scene: 2, col: "1 / 7" },
  { film: "playback", scene: 2, col: "8 / 13", drop: true },
  { film: "playback", scene: 3, col: "3 / 7" },
  { film: "overthinking", scene: 3, col: "8 / 12", drop: true },
];

export default function FilmmakingPage() {
  return (
    <main className={styles.dark}>
      <SiteNav current="Projects" />

      <header className={`below-site-nav ${styles.reelHead}`}>
        <div className={styles.heroCrumbs}>
          <Breadcrumbs items={[{ label: "Projects", href: "/projects" }, { label: "Filmmaking" }]} />
        </div>
        <div className={styles.reelHeadRow}>
          <h1 className={styles.reelTitle}>Filmmaking</h1>
          <p className={styles.reelIntro}>
            Two short films made in Stanford&rsquo;s Arts Intensive Program, from the first rehearsal
            to the takes that didn&rsquo;t make the cut. Pick any clip to step inside the film.
          </p>
        </div>
      </header>

      <section className={styles.mosaic} aria-label="Film reel">
        {TILES.map((t, i) => {
          const f = getFilm(t.film)!;
          const s = t.scene === undefined ? null : f.scenes[t.scene];
          return (
            <MosaicTile
              key={i}
              href={`/experience/filmmaking/${f.slug}`}
              src={s ? s.src : f.loop}
              poster={s ? s.poster : f.poster}
              title={f.title}
              label={s ? s.caption : `${f.year} · Short film · ${f.runtime}`}
              main={!s}
              className={t.drop ? styles.tileDrop : undefined}
              style={{ gridColumn: t.col }}
            />
          );
        })}
      </section>

      <section className={styles.index} aria-label="All films">
        <h2 className={styles.indexHead}>Index</h2>
        <ol>
          {FILMS.map((f, i) => (
            <li key={f.slug}>
              <Link href={`/experience/filmmaking/${f.slug}`} className={styles.indexRow}>
                <span className={styles.indexNum}>{String(i + 1).padStart(2, "0")}</span>
                <span className={styles.indexTitle}>{f.title}</span>
                <span className={styles.indexLog}>{f.logline}</span>
                <span className={styles.indexMeta}>{f.year} · {f.runtime}</span>
                <span className={styles.indexGo} aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
