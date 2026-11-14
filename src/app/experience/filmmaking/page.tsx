import type { Metadata } from "next";
import Link from "next/link";
import SiteNav, { PageHero } from "@/components/SiteNav";
import { FILMS } from "./films";
import { LoopVideo } from "./FilmMedia";
import styles from "./film.module.css";

export const metadata: Metadata = {
  title: "Filmmaking — Mathias Becerra",
  description: "Short films by Mathias Becerra: Overthinking and Playback, made in Stanford's Arts Intensive Program.",
};

export default function FilmmakingPage() {
  return (
    <main className={styles.page}>
      <SiteNav current="Projects" />
      <PageHero
        eyebrow="Field"
        title="Filmmaking"
        intro="Short films, from the first rehearsal to the takes that didn't make the cut."
        accent="var(--bauhaus-red)"
        crumbs={[{ label: "Projects", href: "/projects" }, { label: "Filmmaking" }]}
      />

      <section className={styles.wrap} aria-label="Films">
        <ol className={styles.filmList}>
          {FILMS.map((f, i) => (
            <li key={f.slug}>
              <Link href={`/experience/filmmaking/${f.slug}`} className={styles.filmCard} style={{ "--accent": f.accent } as React.CSSProperties}>
                <div className={styles.filmCardMedia}>
                  <LoopVideo src={f.loop} poster={f.poster} alt={`${f.title}, preview`} />
                </div>
                <div className={styles.filmCardText}>
                  <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                  <h2 className={styles.filmCardTitle}>{f.title}</h2>
                  <p className={styles.meta}>{f.year} · {f.runtime} · Short film</p>
                  <p className={styles.logline}>{f.logline}</p>
                  <span className={styles.cta}>Inside the making of →</span>
                </div>
              </Link>
            </li>
          ))}
        </ol>
      </section>
    </main>
  );
}
