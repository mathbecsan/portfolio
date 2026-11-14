"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./film.module.css";

/* Silent looping preview. Autoplays when on screen (unless the viewer prefers
 * reduced motion, then it shows the poster and plays on hover/focus). */
export function LoopVideo({ src, poster, alt }: { src: string; poster: string; alt: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {});
      else v.pause();
    }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <video
      ref={ref}
      className={styles.loop}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt}
      onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
    />
  );
}

/* YouTube player that only loads the iframe after the viewer clicks play. */
export function FilmPlayer({ youtubeId, poster, title }: { youtubeId: string; poster: string; title: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className={styles.player}>
      {on ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={`${title} (full film)`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
        />
      ) : (
        <button type="button" className={styles.playerCover} onClick={() => setOn(true)} aria-label={`Play ${title}`}>
          <img src={poster} alt="" />
          <span className={styles.playBtn} aria-hidden="true">
            <svg viewBox="0 0 24 24" width="28" height="28"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
          </span>
          <span className={styles.playLabel}>Watch the film</span>
        </button>
      )}
    </div>
  );
}

type Clip = { src: string; poster: string; caption: string };

/* Outtakes: muted previews play on hover; clicking opens the clip with sound. */
export function Outtakes({ clips }: { clips: Clip[] }) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % clips.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + clips.length) % clips.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, clips.length]);

  return (
    <>
      <ul className={styles.outtakes}>
        {clips.map((c, i) => (
          <li key={c.src}>
            <button
              type="button"
              className={styles.outtake}
              onClick={() => setOpen(i)}
              onMouseEnter={(e) => e.currentTarget.querySelector("video")?.play().catch(() => {})}
              onMouseLeave={(e) => { const v = e.currentTarget.querySelector("video"); if (v) { v.pause(); v.currentTime = 0; } }}
              onFocus={(e) => e.currentTarget.querySelector("video")?.play().catch(() => {})}
              onBlur={(e) => e.currentTarget.querySelector("video")?.pause()}
            >
              <video src={c.src} poster={c.poster} muted loop playsInline preload="none" aria-hidden="true" />
              <span className={styles.slate} aria-hidden="true">TAKE {String(i + 1).padStart(2, "0")}</span>
              <span className={styles.outtakeCap}>{c.caption}</span>
            </button>
          </li>
        ))}
      </ul>
      {open !== null && (
        <div className={styles.lightbox} role="dialog" aria-modal="true" aria-label={clips[open].caption} onClick={() => setOpen(null)}>
          <figure onClick={(e) => e.stopPropagation()}>
            <video key={clips[open].src} src={clips[open].src} poster={clips[open].poster} controls autoPlay playsInline />
            <figcaption>
              <span>Take {String(open + 1).padStart(2, "0")} · {clips[open].caption}</span>
              <button type="button" onClick={() => setOpen(null)}>Close ✕</button>
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}

/* Mosaic tile for the Filmmaking index: a silent loop that reveals the film's
 * title on hover/focus and links to the film's page. */
export function MosaicTile({ href, src, poster, title, label, className, style }: {
  href: string; src: string; poster: string; title: string; label: string;
  className?: string; style?: React.CSSProperties;
}) {
  return (
    <Link href={href} className={`${styles.tile} ${className ?? ""}`} style={style}
      aria-label={`${title}: ${label}. Open the film page`}>
      <LoopVideo src={src} poster={poster} alt="" />
      <span className={styles.tileVeil} aria-hidden="true">
        <span className={styles.tileLabel}>{label}</span>
        <span className={styles.tileTitle}>{title}</span>
        <span className={styles.tileGo}>View film →</span>
      </span>
    </Link>
  );
}
