import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SiteNav, { Breadcrumbs } from "@/components/SiteNav";
import { FILMS, getFilm } from "../films";
import { FilmPlayer, Outtakes } from "../FilmMedia";
import styles from "../film.module.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return FILMS.map((f) => ({ film: f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ film: string }> }): Promise<Metadata> {
  const f = getFilm((await params).film);
  return f ? { title: `${f.title} (${f.year}) — Mathias Becerra`, description: f.logline } : {};
}

export default async function FilmPage({ params }: { params: Promise<{ film: string }> }) {
  const { film } = await params;
  const f = getFilm(film);
  if (!f) notFound();
  const i = FILMS.indexOf(f);
  const next = FILMS[(i + 1) % FILMS.length];

  return (
    <main className={styles.page} style={{ "--accent": f.accent } as React.CSSProperties}>
      <SiteNav current="Projects" />

      {/* ── Hero: title + the film itself ── */}
      <header className={`below-site-nav ${styles.hero}`}>
        <div className={styles.heroInner}>
          <div className={styles.heroCrumbs}>
            <Breadcrumbs items={[{ label: "Projects", href: "/projects" }, { label: "Filmmaking", href: "/experience/filmmaking" }, { label: f.title }]} />
          </div>
          <p className={styles.eyebrow}>Short film · {f.year}</p>
          <h1 className={styles.heroTitle}>{f.title}</h1>
          <p className={styles.heroLog}>{f.logline}</p>
          <FilmPlayer youtubeId={f.youtubeId} poster={f.poster} title={f.title} />
        </div>
      </header>

      <div className={styles.wrap}>
        {/* ── Synopsis + project details ── */}
        <section className={styles.twoCol}>
          <div>
            <h2 className={styles.h2}>Synopsis</h2>
            <p className={styles.synopsis}>{f.synopsis}</p>
          </div>
          <div>
            <h2 className={styles.h2}>Project details</h2>
            <dl className={styles.details}>
              {f.details.map((d) => (
                <div key={d.label}><dt>{d.label}</dt><dd>{d.value}</dd></div>
              ))}
            </dl>
          </div>
        </section>

        {/* ── Credits ── */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Credits</h2>
          <dl className={styles.credits}>
            {f.credits.map((c) => (
              <div key={c.role}><dt>{c.role}</dt><dd>{c.names.join(", ")}</dd></div>
            ))}
          </dl>
          {f.dedication && <p className={styles.dedication}>{f.dedication}</p>}
        </section>

        {/* ── Process ── */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Process</h2>
          <div className={styles.process}>
            {f.process.map((p, k) => (
              <p key={k}><span className={styles.step}>{String(k + 1).padStart(2, "0")}</span>{p}</p>
            ))}
          </div>
        </section>

        {/* ── Stills ── */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Stills</h2>
          <ul className={styles.stills}>
            {f.stills.map((s) => (
              <li key={s.src}>
                <figure>
                  <img src={s.src} alt={s.caption} loading="lazy" decoding="async" />
                  <figcaption>{s.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Behind the scenes ── */}
        <section className={styles.section}>
          <h2 className={styles.h2}>Behind the scenes</h2>
          <ul className={f.bts.length === 1 ? styles.btsSingle : styles.bts}>
            {f.bts.map((b) => (
              <li key={b.src}>
                <figure>
                  <img src={b.src} alt={b.caption} loading="lazy" decoding="async" />
                  <figcaption>{b.caption}</figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>

        {/* ── Bloopers / discarded takes ── */}
        <section className={styles.section}>
          <h2 className={styles.h2}>From the cutting-room floor</h2>
          <p className={styles.sectionIntro}>
            Bloopers and takes we left out. Hover to preview, click to watch with sound.
          </p>
          <Outtakes clips={f.outtakes} />
        </section>

        {/* ── Next film ── */}
        {next.slug !== f.slug && (
          <Link href={`/experience/filmmaking/${next.slug}`} className={styles.next}>
            <span>Next film</span>
            <strong>{next.title} →</strong>
          </Link>
        )}
      </div>
    </main>
  );
}
