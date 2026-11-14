import type { Metadata } from "next";
import SiteNav, { Breadcrumbs } from "@/components/SiteNav";
import { FILMS } from "./films";
import { MosaicTile } from "./FilmMedia";
import styles from "./film.module.css";

export const metadata: Metadata = {
  title: "Filmmaking — Mathias Becerra",
  description: "Short films by Mathias Becerra: Overthinking and Playback, made in Stanford's Arts Intensive Program.",
};

/* One looping tile per film, staggered left/right like a director's reel.
 * Hover (or focus) reveals the title; click opens the film page. */
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
            Two short films made in Stanford&rsquo;s Arts Intensive Program. Open one to see how it was
            made, from the first rehearsal to the takes that didn&rsquo;t make the cut.
          </p>
        </div>
      </header>

      <section className={styles.reel} aria-label="Films">
        {FILMS.map((f, i) => (
          <figure key={f.slug} className={i % 2 ? styles.reelRight : styles.reelLeft}>
            <MosaicTile
              href={`/experience/filmmaking/${f.slug}`}
              src={f.loop}
              poster={f.poster}
              title={f.title}
              label={f.logline}
            />
            <figcaption className={styles.reelCap}>
              <span className={styles.reelNum}>{String(i + 1).padStart(2, "0")}</span>
              <span className={styles.reelName}>{f.title}</span>
              <span className={styles.reelMeta}>{f.year} · {f.runtime}</span>
            </figcaption>
          </figure>
        ))}
      </section>
    </main>
  );
}
