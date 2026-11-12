"use client";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { SOCIALS, TOPICS } from "./EighthScreen";

/* ── /contact — "Send me a postcard" ───────────────────────────────────
 * Visitors write a note on a Bauhaus postcard, pick a topic by choosing a
 * stamp, and "post" it. The site is static (no mail server), so sending
 * plays a short mail-slot animation and then opens the visitor's email app
 * with the postcard pre-filled. Links reuse the homepage contact section. */

const EMAIL = "mathbecsan@gmail.com";
const MAX = 800;

// One stamp per topic: a Bauhaus shape + colour.
const STAMPS: Record<string, { color: string; shape: "circle" | "square" | "triangle" | "half" | "diamond" }> = {
  "Mentoring":       { color: "var(--bauhaus-red)",    shape: "circle" },
  "Collaboration":   { color: "var(--bauhaus-blue)",   shape: "square" },
  "Freelance":       { color: "var(--bauhaus-yellow)", shape: "triangle" },
  "Research":        { color: "var(--charcoal)",       shape: "half" },
  "Just saying hi!": { color: "var(--bauhaus-red)",    shape: "diamond" },
};

function Shape({ shape, color }: { shape: string; color: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true">
      {shape === "circle"   && <circle cx="20" cy="20" r="14" fill={color} />}
      {shape === "square"   && <rect x="7" y="7" width="26" height="26" fill={color} />}
      {shape === "triangle" && <polygon points="20,5 35,33 5,33" fill={color} />}
      {shape === "half"     && <path d="M5 28a15 15 0 0 1 30 0z" fill={color} />}
      {shape === "diamond"  && <polygon points="20,4 36,20 20,36 4,20" fill={color} />}
    </svg>
  );
}

const LINKS = [
  { label: "Book a call",     sub: "Pick a time on Calendly", href: "https://calendly.com/mathbecsan",   color: "var(--bauhaus-blue)" },
  { label: "Buy me a coffee", sub: "Support my work",         href: "https://buymeacoffee.com/mathbecsan", color: "var(--bauhaus-red)" },
  { label: "Résumé",          sub: "Request it by email",     href: `mailto:${EMAIL}?subject=${encodeURIComponent("Résumé request")}`, color: "var(--bauhaus-yellow)" },
];

export default function ContactPostcard() {
  const [topic, setTopic] = useState<string>(TOPICS[0]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [stage, setStage] = useState<"write" | "posting" | "sent">("write");
  const [copied, setCopied] = useState(false);
  const [today, setToday] = useState("");

  // Postmark date, set on the client so the prerendered page never shows a stale date.
  useEffect(() => {
    const t = setTimeout(() => setToday(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase()), 0);
    return () => clearTimeout(t);
  }, []);

  const stamp = STAMPS[topic] ?? STAMPS[TOPICS[0]];
  const canSend = name.trim() && message.trim() && /\S+@\S+\.\S+/.test(email);

  const send = (e: FormEvent) => {
    e.preventDefault();
    if (!canSend) return;
    const href = `mailto:${EMAIL}?subject=${encodeURIComponent(`[${topic}] Postcard from ${name.trim()}`)}&body=${encodeURIComponent(`${message.trim()}\n\n— ${name.trim()}\nReply to: ${email.trim()}`)}`;
    let reduce = false;
    try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch {}
    setStage("posting");
    setTimeout(() => { window.location.href = href; setStage("sent"); }, reduce ? 0 : 950);
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(EMAIL); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <section className="cp" aria-label="Write me a postcard">
      <style>{`
        .cp { background: var(--paper); color: var(--charcoal); padding: clamp(40px, 6vw, 88px) var(--gutter) clamp(64px, 8vw, 112px); }
        .cp__grid { max-width: 1280px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1.65fr) minmax(0, 1fr); gap: clamp(28px, 4vw, 64px); align-items: start; }
        @media (max-width: 960px) { .cp__grid { grid-template-columns: 1fr; } }
        .cp__kicker { display: flex; align-items: center; gap: 10px; margin: 0 0 16px; font-family: var(--font-body); font-size: 12px; font-weight: 800; letter-spacing: 0.22em; text-transform: uppercase; }
        .cp__kicker::before { content: ""; width: 10px; height: 10px; background: var(--bauhaus-red); }

        /* ── the postcard ── */
        .pc-wrap { position: relative; perspective: 1400px; }
        .pc {
          position: relative; display: grid; grid-template-columns: 1.25fr 1fr; min-height: clamp(380px, 38vw, 470px);
          background: #FFFDF7; border: 2px solid var(--ink); box-shadow: 12px 12px 0 var(--ink);
          transition: transform 0.9s cubic-bezier(0.6, 0, 0.3, 1), opacity 0.9s ease, box-shadow 0.4s;
        }
        .pc[data-stage="posting"] { transform: translateY(40%) scale(0.55) rotate(-4deg); opacity: 0; box-shadow: 0 0 0 var(--ink); }
        @media (max-width: 640px) { .pc { grid-template-columns: 1fr; box-shadow: 8px 8px 0 var(--ink); } .pc__right { border-left: 0 !important; border-top: 2px dashed rgba(13,13,13,0.25); } }
        .pc__left { padding: clamp(20px, 2.6vw, 32px); display: flex; flex-direction: column; }
        .pc__greet { font-family: var(--font-display); font-size: clamp(30px, 3vw, 40px); letter-spacing: 0.02em; text-transform: uppercase; margin: 0 0 6px; color: var(--ink); }
        .pc__msg {
          flex: 1; min-height: 210px; resize: vertical; width: 100%; border: 0; outline: none; background-color: transparent; color: var(--ink);
          font-family: var(--font-body); font-size: 17px; line-height: 34px; padding: 0;
          background-image: repeating-linear-gradient(to bottom, transparent 0, transparent 33px, rgba(13,13,13,0.16) 33px, rgba(13,13,13,0.16) 34px);
        }
        .pc__msg::placeholder { color: rgba(31,41,55,0.4); }
        .pc__count { align-self: flex-end; margin-top: 6px; font-family: var(--font-geist-mono), monospace; font-size: 11px; color: rgba(31,41,55,0.5); }
        .pc__right { position: relative; border-left: 2px dashed rgba(13,13,13,0.25); padding: clamp(20px, 2.6vw, 32px); display: flex; flex-direction: column; justify-content: flex-end; gap: 18px; }
        .pc__stamp {
          position: absolute; top: 18px; right: 18px; z-index: 1; width: 86px; height: 104px;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; padding: 10px;
          background: #fff; border: 3px dotted var(--ink); outline: 1.5px solid var(--ink); outline-offset: -9px;
          box-shadow: 2px 2px 0 rgba(13,13,13,0.15);
        }
        .pc__stamp svg { width: 46px; height: 46px; animation: stampIn 0.45s cubic-bezier(0.2, 1.6, 0.4, 1); }
        .pc__stamp small { font-family: var(--font-body); font-size: 9px; font-weight: 800; letter-spacing: 0.14em; text-transform: uppercase; text-align: center; line-height: 1.2; }
        @keyframes stampIn { from { transform: scale(1.8) rotate(-12deg); opacity: 0; } to { transform: none; opacity: 1; } }
        .pc__postmark {
          position: absolute; top: 40px; right: 118px; width: 92px; height: 92px; border-radius: 50%; border: 2px solid rgba(0,92,170,0.75);
          display: grid; place-items: center; text-align: center; transform: rotate(-14deg); pointer-events: none;
          font-family: var(--font-geist-mono), monospace; font-size: 9px; font-weight: 700; letter-spacing: 0.08em; color: rgba(0,92,170,0.85); line-height: 1.5;
        }
        .pc__postmark::after { content: ""; position: absolute; left: 86%; top: 30%; width: 40px; height: 36px;
          background: repeating-linear-gradient(to bottom, rgba(0,92,170,0.65) 0 2px, transparent 2px 9px); }
        .pc__to { font-family: var(--font-body); font-size: 14px; line-height: 1.5; margin-top: 120px; }
        .pc__to b { display: block; font-size: 12px; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(31,41,55,0.55); margin-bottom: 2px; }
        .pc__field { display: block; }
        .pc__field span { display: block; font-family: var(--font-body); font-size: 11px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(31,41,55,0.55); margin-bottom: 4px; }
        .pc__field input {
          width: 100%; border: 0; border-bottom: 2px solid var(--ink); background: transparent; outline: none; padding: 6px 0; color: var(--ink);
          font-family: var(--font-body); font-size: 16px; transition: border-color 0.2s;
        }
        .pc__field input:focus, .pc__msg:focus { border-color: var(--bauhaus-red); }
        .pc__msg:focus { box-shadow: inset 0 -2px 0 var(--bauhaus-red); }

        /* ── stamp picker + send ── */
        .cp__stamps { display: flex; flex-wrap: wrap; gap: 10px; margin: clamp(28px, 3vw, 40px) 0 0; }
        .cp__stamps legend { width: 100%; margin-bottom: 10px; font-family: var(--font-body); font-size: 12px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; }
        .stamp-btn {
          display: inline-flex; align-items: center; gap: 10px; height: 46px; padding: 0 16px 0 10px; cursor: pointer;
          border: 2px solid var(--ink); background: #FFFDF7; color: var(--ink); box-shadow: 3px 3px 0 var(--ink);
          font-family: var(--font-body); font-size: 13px; font-weight: 700; transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
        }
        .stamp-btn svg { width: 24px; height: 24px; }
        .stamp-btn:hover { transform: translate(-1px, -1px); box-shadow: 4px 4px 0 var(--ink); }
        .stamp-btn[aria-checked="true"] { background: var(--ink); color: var(--cream); transform: translate(3px, 3px); box-shadow: 0 0 0 var(--ink); }
        .stamp-btn:focus-visible, .cp__send:focus-visible, .cp-link:focus-visible, .cp-copy:focus-visible { outline: 3px solid var(--bauhaus-blue); outline-offset: 3px; }
        .cp__actions { display: flex; flex-wrap: wrap; align-items: center; gap: 14px 20px; margin-top: 24px; }
        .cp__send {
          display: inline-flex; align-items: center; gap: 12px; height: 56px; padding: 0 28px; cursor: pointer;
          border: 2px solid var(--ink); background: var(--bauhaus-red); color: #fff; box-shadow: 5px 5px 0 var(--ink);
          font-family: var(--font-body); font-size: 14px; font-weight: 800; letter-spacing: 0.18em; text-transform: uppercase; transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
        }
        .cp__send:hover:not(:disabled) { transform: translate(-2px, -2px); box-shadow: 7px 7px 0 var(--ink); }
        .cp__send:disabled { opacity: 0.45; cursor: not-allowed; }
        .cp__note { font-family: var(--font-body); font-size: 13px; color: rgba(31,41,55,0.65); margin: 0; max-width: 360px; }

        /* ── after posting ── */
        .cp__sent { border: 2px solid var(--ink); background: #FFFDF7; box-shadow: 12px 12px 0 var(--ink); padding: clamp(28px, 4vw, 48px); text-align: center; }
        .cp__sent svg { width: 120px; height: auto; margin: 0 auto 18px; display: block; animation: stampIn 0.5s cubic-bezier(0.2, 1.6, 0.4, 1); }
        .cp__sent h2 { font-family: var(--font-display); font-weight: 400; font-size: clamp(36px, 4vw, 54px); text-transform: uppercase; margin: 0 0 10px; color: var(--ink); }
        .cp__sent p { font-family: var(--font-body); font-size: 16px; line-height: 1.6; margin: 0 auto 20px; max-width: 460px; color: rgba(31,41,55,0.8); }

        /* ── side panel ── */
        .cp-side { display: flex; flex-direction: column; gap: 14px; }
        .cp-mail { border: 2px solid var(--ink); background: var(--ink); color: var(--cream); padding: 22px; box-shadow: 8px 8px 0 var(--bauhaus-yellow); }
        .cp-mail b { display: block; font-family: var(--font-body); font-size: 11px; font-weight: 800; letter-spacing: 0.2em; text-transform: uppercase; color: rgba(240,237,230,0.6); margin-bottom: 8px; }
        .cp-mail a { display: block; font-family: var(--font-body); font-weight: 700; font-size: clamp(18px, 1.7vw, 22px); color: var(--cream); text-decoration: none; word-break: break-all; }
        .cp-mail a:hover { color: var(--bauhaus-yellow); }
        .cp-copy { margin-top: 14px; height: 36px; padding: 0 14px; border: 1px solid rgba(240,237,230,0.4); background: transparent; color: var(--cream); cursor: pointer;
          font-family: var(--font-body); font-size: 12px; font-weight: 800; letter-spacing: 0.16em; text-transform: uppercase; }
        .cp-copy:hover { background: var(--cream); color: var(--ink); }
        .cp-link { display: flex; align-items: center; gap: 14px; padding: 16px 18px; border: 2px solid var(--ink); background: #FFFDF7; color: var(--ink); text-decoration: none; transition: transform 0.15s, box-shadow 0.15s; box-shadow: 4px 4px 0 var(--ink); }
        .cp-link:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 var(--ink); }
        .cp-link i { width: 14px; height: 14px; flex-shrink: 0; background: var(--c); }
        .cp-link strong { display: block; font-family: var(--font-body); font-size: 15px; }
        .cp-link small { display: block; font-family: var(--font-body); font-size: 13px; color: rgba(31,41,55,0.6); }
        .cp-link em { margin-left: auto; font-style: normal; font-weight: 800; }
        .cp-socials { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 6px; }
        .cp-socials a { width: 48px; height: 48px; display: grid; place-items: center; border: 2px solid var(--ink); background: #FFFDF7; color: var(--ink); transition: background 0.15s, color 0.15s; }
        .cp-socials a:hover { background: var(--ink); color: var(--cream); }
        .cp-socials svg { width: 20px; height: 20px; fill: currentColor; }
        @media (prefers-reduced-motion: reduce) { .pc, .pc__stamp svg, .cp__sent svg { transition: none; animation: none; } }
      `}</style>

      <div className="cp__grid">
        {/* ── Postcard composer ── */}
        <div>
          <p className="cp__kicker">Write me a postcard</p>

          {stage === "sent" ? (
            <div className="cp__sent" role="status">
              <Shape shape={stamp.shape} color={stamp.color} />
              <h2>Postcard ready to send</h2>
              <p>Your email app should have opened with your note filled in — just hit send. If nothing opened, email me directly at <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.</p>
              <button type="button" className="cp__send" onClick={() => { setStage("write"); setMessage(""); }}>Write another</button>
            </div>
          ) : (
            <form onSubmit={send} noValidate>
              <div className="pc-wrap">
                <div className="pc" data-stage={stage}>
                  <div className="pc__left">
                    <p className="pc__greet">Dear Mathias,</p>
                    <label style={{ display: "contents" }}>
                      <span style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)" }}>Your message</span>
                      <textarea className="pc__msg" value={message} maxLength={MAX} required
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell me about your project, idea, or just say hello…" />
                    </label>
                    <span className="pc__count" aria-hidden="true">{message.length}/{MAX}</span>
                  </div>
                  <div className="pc__right">
                    <div className="pc__stamp" aria-label={`Stamp: ${topic}`} role="img">
                      <Shape key={topic} shape={stamp.shape} color={stamp.color} />
                      <small>{topic}</small>
                    </div>
                    <div className="pc__postmark" aria-hidden="true">{today || " "}<br />MATHBECSAN<br />POST</div>
                    <p className="pc__to"><b>To</b>Mathias Becerra<br />{EMAIL}</p>
                    <label className="pc__field"><span>From</span>
                      <input type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" required />
                    </label>
                    <label className="pc__field"><span>Reply to</span>
                      <input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                    </label>
                  </div>
                </div>
              </div>

              <fieldset className="cp__stamps" role="radiogroup" aria-label="What's it about?" style={{ border: 0, padding: 0 }}>
                <legend>Pick a stamp — what&apos;s it about?</legend>
                {TOPICS.map((t) => {
                  const st = STAMPS[t] ?? STAMPS[TOPICS[0]];
                  return (
                    <button key={t} type="button" role="radio" aria-checked={topic === t} className="stamp-btn" onClick={() => setTopic(t)}>
                      <Shape shape={st.shape} color={st.color} />{t}
                    </button>
                  );
                })}
              </fieldset>

              <div className="cp__actions">
                <button type="submit" className="cp__send" disabled={!canSend || stage === "posting"}>
                  {stage === "posting" ? "Posting…" : "Send postcard"} <span aria-hidden="true">→</span>
                </button>
                <p className="cp__note">
                  {canSend ? "Opens your email app with your postcard filled in, ready to send." : "Add a message, your name and a reply email to send."}
                </p>
              </div>
            </form>
          )}
        </div>

        {/* ── Other ways to reach me ── */}
        <aside className="cp-side" aria-label="Other ways to reach me">
          <p className="cp__kicker">Or reach me directly</p>
          <div className="cp-mail">
            <b>Email</b>
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <button type="button" className="cp-copy" onClick={copy} aria-live="polite">{copied ? "Copied ✓" : "Copy address"}</button>
          </div>
          {LINKS.map((l) => (
            <a key={l.label} className="cp-link" href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" style={{ "--c": l.color } as CSSProperties}>
              <i aria-hidden="true" />
              <span><strong>{l.label}</strong><small>{l.sub}</small></span>
              <em aria-hidden="true">→</em>
            </a>
          ))}
          <div className="cp-socials">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} title={s.label}>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d={s.svg} /></svg>
              </a>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
