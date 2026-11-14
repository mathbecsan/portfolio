import s from "./HomeExtras.module.css";

/* ── "Take the first step forward" (home, below the big email) ───────────
 * Background: the opening shot of the short film Overthinking (a man stepping
 * into an elevator), a literal first step. */

const STRIPE = ["#E63329", "#F5C500", "#2952A3", "#f0ede6"];

export default function FirstStep() {
  return (
    <section className={s.step} aria-labelledby="first-step-title">
      <img className={s.stepBg} src="/films/overthinking/still-1.jpg" alt="" loading="lazy" decoding="async" />
      <div className={s.stepShade} aria-hidden="true" />
      <div className={s.stepInner}>
        <div>
          <h2 id="first-step-title" className={s.stepTitle}>Take the first<br /><span>step forward</span></h2>
          <p className={s.stepText}>
            Have a product, a study or a story you want to bring to life? Tell me about it and
            let&rsquo;s find the best way to build it together.
          </p>
          <div className={s.stepBtns}>
            <a className={`${s.btn} ${s.btnPrimary}`} href="https://calendly.com/mathbecsan" target="_blank" rel="noopener noreferrer">
              Book a consultation <span aria-hidden="true">→</span>
            </a>
            <a className={`${s.btn} ${s.btnGhost}`} href="mailto:mathbecsan@gmail.com">Send an enquiry</a>
          </div>
        </div>
        <blockquote className={s.quote}>
          <p>&ldquo;The beginning is the most important part of the work.&rdquo;</p>
          <footer>Plato</footer>
        </blockquote>
      </div>
      <div className={s.stripe} aria-hidden="true">{STRIPE.map((c) => <i key={c} style={{ background: c }} />)}</div>
    </section>
  );
}
