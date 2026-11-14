import type { CSSProperties, ReactNode } from "react";
import s from "./HomeExtras.module.css";

/* ── "Why people work with me" (home, below Key Principles) ──────────────
 * Six reasons, each with a small Bauhaus glyph built from the site's
 * circle / square / triangle language. Edit REASONS to change the copy. */

const R = "#E63329", B = "#2952A3", Y = "#F5C500", K = "#0d0d0d";

const Glyph = ({ children }: { children: ReactNode }) => (
  <svg className={s.glyph} viewBox="0 0 52 52" aria-hidden="true">{children}</svg>
);

const REASONS: { title: string; text: string; color: string; glyph: ReactNode }[] = [
  {
    title: "Idea to prototype",
    text: "I turn a rough idea into something you can click and test early, then refine it with you. Ship early, refine later.",
    color: Y,
    glyph: <Glyph><circle cx="20" cy="22" r="16" fill={Y} /><rect x="26" y="26" width="22" height="22" fill={K} /></Glyph>,
  },
  {
    title: "A designer who codes",
    text: "I design the experience and build it myself, from wireframes to production front-end, so nothing gets lost in the hand-off.",
    color: B,
    glyph: <Glyph><path d="M4 30a22 22 0 0 1 44 0z" fill={R} /><rect x="14" y="30" width="24" height="18" fill={B} /></Glyph>,
  },
  {
    title: "Grounded in research",
    text: "Trained in Symbolic Systems at Stanford, I base decisions on how people think and behave: interviews, testing and real metrics.",
    color: B,
    glyph: <Glyph><circle cx="26" cy="26" r="21" fill="none" stroke={B} strokeWidth="6" /><circle cx="26" cy="26" r="7" fill={K} /></Glyph>,
  },
  {
    title: "Built for everyone",
    text: "Accessibility, multilingual users and low-friction flows are part of the brief from day one, not a fix at the end.",
    color: R,
    glyph: <Glyph><path d="M2 44 14 22l12 22z" fill={Y} /><circle cx="32" cy="18" r="10" fill={R} /><rect x="32" y="30" width="16" height="16" fill={B} /></Glyph>,
  },
  {
    title: "Clear & collaborative",
    text: "You always know where things stand: regular check-ins, honest timelines, and a real openness to feedback.",
    color: R,
    glyph: <Glyph><circle cx="19" cy="24" r="15" fill={R} /><circle cx="33" cy="28" r="15" fill={B} style={{ mixBlendMode: "multiply" }} /></Glyph>,
  },
  {
    title: "Story-driven",
    text: "A background in filmmaking and visual design means products, pitches and case studies that tell a story people remember.",
    color: Y,
    glyph: <Glyph><rect x="2" y="8" width="48" height="36" rx="3" fill={K} /><path d="M21 17v18l15-9z" fill={Y} /><rect x="2" y="8" width="48" height="5" fill={R} /></Glyph>,
  },
];

export default function WhyWorkWithMe() {
  return (
    <section className={s.why} aria-labelledby="why-title">
      <div className={s.whyInner}>
        <div className={s.whyHead}>
          <h2 id="why-title" className={s.whyTitle}>Why people <em>work with me</em></h2>
          <p className={s.whyLede}>Design, engineering and storytelling under one roof, guided by the same principles above.</p>
        </div>
        <ul className={s.whyGrid}>
          {REASONS.map((r) => (
            <li key={r.title}>
              <article className={s.card} style={{ "--c": r.color } as CSSProperties}>
                {r.glyph}
                <h3 className={s.cardTitle}>{r.title}</h3>
                <p className={s.cardText}>{r.text}</p>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
