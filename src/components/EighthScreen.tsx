"use client";

import { useState, type MouseEvent } from "react";

export const TOPICS  = ["Mentoring", "Collaboration", "Freelance", "Research", "Just saying hi!"];

export const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/mathbecsan",              svg: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { label: "Dribbble", href: "https://dribbble.com/mathbecsan", svg: "M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.066.02c-5.79 2.015-7.86 6.025-8.04 6.4 1.73 1.358 3.92 2.166 6.29 2.166 1.42 0 2.77-.29 4-.814zm-11.62-2.58c.232-.4 3.045-5.055 8.332-6.765.135-.045.27-.084.405-.12-.26-.585-.54-1.167-.832-1.74C7.17 11.775 2.206 11.71 1.756 11.7l-.004.312c0 2.633.998 5.037 2.634 6.855zm-2.42-8.955c.46.008 4.683.026 9.477-1.248-1.698-3.018-3.53-5.558-3.8-5.928-2.868 1.35-5.01 3.99-5.676 7.17zM9.6 2.052c.282.38 2.145 2.914 3.822 6 3.645-1.365 5.19-3.44 5.373-3.702-1.81-1.61-4.19-2.586-6.795-2.586-.825 0-1.63.1-2.4.285zm10.335 3.483c-.218.29-1.935 2.493-5.724 4.04.24.49.47.985.68 1.486.08.18.15.36.22.53 3.41-.43 6.8.26 7.14.33-.02-2.42-.88-4.64-2.31-6.38z" },
  { label: "Behance", href: "https://www.behance.net/mathiasbecerra", svg: "M16.969 16.927a2.561 2.561 0 0 0 1.901.677 2.501 2.501 0 0 0 1.531-.475c.362-.235.636-.584.779-.99h2.585a5.091 5.091 0 0 1-1.9 2.896 5.292 5.292 0 0 1-3.091.88 5.839 5.839 0 0 1-2.284-.433 4.871 4.871 0 0 1-1.723-1.211 5.657 5.657 0 0 1-1.08-1.874 7.057 7.057 0 0 1-.383-2.393c-.005-.8.129-1.595.396-2.349a5.313 5.313 0 0 1 5.088-3.604 4.87 4.87 0 0 1 2.376.563c.661.362 1.231.87 1.668 1.485a6.2 6.2 0 0 1 .943 2.133c.194.821.263 1.666.205 2.508h-7.699c-.063.79.184 1.574.688 2.187ZM6.947 4.084a8.065 8.065 0 0 1 1.928.198 4.29 4.29 0 0 1 1.49.638c.418.303.748.711.958 1.182.241.579.357 1.203.341 1.83a3.506 3.506 0 0 1-.506 1.961 3.726 3.726 0 0 1-1.503 1.287 3.588 3.588 0 0 1 2.027 1.437c.464.747.697 1.615.67 2.494a4.593 4.593 0 0 1-.423 2.032 3.945 3.945 0 0 1-1.163 1.413 5.114 5.114 0 0 1-1.683.807 7.135 7.135 0 0 1-1.928.259H0V4.084h6.947Zm-.235 12.9c.308.004.616-.029.916-.099a2.18 2.18 0 0 0 .766-.332c.228-.158.411-.371.534-.619.142-.317.208-.663.191-1.009a2.08 2.08 0 0 0-.642-1.715 2.618 2.618 0 0 0-1.696-.505h-3.54v4.279h3.471Zm13.635-5.967a2.13 2.13 0 0 0-1.654-.619 2.336 2.336 0 0 0-1.163.259 2.474 2.474 0 0 0-.738.62 2.359 2.359 0 0 0-.396.792c-.074.239-.12.485-.137.734h4.769a3.239 3.239 0 0 0-.679-1.785l-.002-.001Zm-13.813-.648a2.254 2.254 0 0 0 1.423-.433c.399-.355.607-.88.56-1.413a1.916 1.916 0 0 0-.178-.891 1.298 1.298 0 0 0-.495-.533 1.851 1.851 0 0 0-.711-.274 3.966 3.966 0 0 0-.835-.073H3.241v3.631h3.293v-.014ZM21.62 5.122h-5.976v1.527h5.976V5.122Z" },
  { label: "LinkedIn",  href: "https://linkedin.com/in/mathiasbecerrasanchez", svg: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  { label: "GitHub",    href: "https://github.com/mathbecsan",                 svg: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
];

export default function EighthScreen() {
  const [topic,   setTopic]   = useState("Mentoring");
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [sent,    setSent]    = useState(false);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    window.open(`mailto:mathbecsan@gmail.com?subject=${encodeURIComponent(`[${topic}] from ${name}`)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`);
    setSent(true);
  };

  const inputCls: React.CSSProperties = {
    flex: "1 1 150px", padding: "14px 20px",
    borderRadius: 999, border: "1.5px solid #1a1a2e",
    background: "transparent", fontFamily: "var(--font-geist-sans), sans-serif",
    fontSize: "clamp(13px,1.1vw,15px)", color: "#1a1a2e",
    outline: "none", minWidth: 0,
  };

  return (
    <section id="contact">

      {/* ── Big email ── */}
      <div style={{ background: "#F5E6C0", textAlign: "center", padding: "clamp(32px,5vw,64px) 20px", lineHeight: 1 }}>
        <a href="mailto:mathbecsan@gmail.com" style={{
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontSize: "clamp(28px,6vw,88px)",
          fontWeight: 700, color: "#364153",
          textDecoration: "none", letterSpacing: "-.02em",
          transition: "color .2s",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#E7000B"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#364153"; }}
        >
          mathbecsan@gmail.com
        </a>
      </div>

      {/* ── Bauhaus strip between email and LET'S TALK ── */}
      <div style={{
        height: "clamp(90px, 12vw, 155px)",
        backgroundImage: "url('/bauhaus-pattern.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
      }} />

      {/* ── LET'S TALK ── */}
      <div style={{ background: "#FFE4B4", position: "relative", overflow: "hidden" }}>

        {/* Top-left red quarter circle only */}
        <div style={{
          position: "absolute", top: 0, left: 0,
          width: "clamp(80px,12vw,180px)", height: "clamp(80px,12vw,180px)",
          background: "#E7000B",
          borderRadius: "0 0 100% 0",
          zIndex: 0,
        }} />

        {/* Content */}
        <div style={{
          position: "relative", zIndex: 1,
          maxWidth: 1100, margin: "0 auto",
          padding: "clamp(56px,8vw,100px) clamp(28px,6vw,80px) clamp(48px,7vw,80px)",
        }}>

          {/* Title row */}
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "clamp(24px,4vw,56px)", marginBottom: "clamp(24px,4vw,40px)" }}>
            <h2 style={{
              fontFamily: "var(--font-bebas), sans-serif", fontWeight: 400,
              fontSize: "clamp(64px,11vw,150px)",
              color: "#0d0d0d", margin: 0,
              lineHeight: .9, letterSpacing: "0.02em",
              textTransform: "uppercase",
              flexShrink: 0,
            }}>
              LET&apos;S<br /><span style={{ color: "#E7000B" }}>TALK</span>
            </h2>
            <p style={{
              fontFamily: "var(--font-geist-sans), sans-serif",
              fontSize: "clamp(16px,1.8vw,24px)",
              color: "#364153", lineHeight: 1.6,
              margin: "clamp(8px,1vw,16px) 0 0",
              maxWidth: 380, flex: "1 1 220px",
            }}>
              Have a project in mind or just want to say hello?<br />
              I&apos;d love to hear from you.
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: "clamp(20px,3vw,36px)" }}>
            {[
              { label: "GITHUB",          href: "https://github.com/mathbecsan",       bg: "#fff",    border: "#1a1a2e", color: "#1a1a2e", icon: "⊞" },
              { label: "BOOK A CALL",     href: "https://calendly.com/mathbecsan",     bg: "#155DFC", border: "#155DFC", color: "#fff",    icon: "📅" },
              { label: "BUY ME A COFFEE", href: "https://buymeacoffee.com/mathbecsan", bg: "#E7000B", border: "#E7000B", color: "#fff",    icon: "☕" },
              { label: "RESUME ←",        href: "/resume.pdf",                         bg: "transparent", border: "transparent", color: "#F0B100", icon: "" },
            ].map(b => {
              const sharedStyle = {
                padding: "11px 22px", borderRadius: 6,
                border: `2px solid ${b.border}`,
                background: b.bg, color: b.color,
                fontFamily: "var(--font-geist-sans), sans-serif", fontWeight: 700,
                fontSize: "clamp(10px, 1vw, 13px)", letterSpacing: ".08em",
                textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
                transition: "transform .18s, box-shadow .18s",
                cursor: "pointer",
              } as const;
              const handlers = {
                onMouseEnter: (e: MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,.15)"; },
                onMouseLeave: (e: MouseEvent<HTMLElement>) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; },
              };
              if (b.label === "RESUME ←") {
                return (
                  <button key={b.label} type="button" style={sharedStyle} {...handlers}
                    onClick={() => alert("Request via email")}
                  >
                    {b.icon && <span>{b.icon}</span>}{b.label}
                  </button>
                );
              }
              return (
                <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer" style={sharedStyle} {...handlers}>
                  {b.icon && <span>{b.icon}</span>}{b.label}
                </a>
              );
            })}
          </div>

          {/* Form */}
          {sent ? (
            <div style={{ padding: "24px 0" }}>
              <p style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 20, color: "#1a1a2e", margin: "0 0 12px" }}>✉️ Mail client opened — talk soon!</p>
              <button onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
                style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 11, letterSpacing: ".1em", background: "none", border: "1.5px solid #1a1a2e", padding: "9px 22px", borderRadius: 999, cursor: "pointer", color: "#1a1a2e" }}>
                SEND ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={send} style={{ maxWidth: 760 }}>
              {/* Row 1 */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                <select value={topic} onChange={e => setTopic(e.target.value)}
                  style={{ ...inputCls, flex: "0 1 180px", cursor: "pointer" }}>
                  {TOPICS.map(t => <option key={t}>{t}</option>)}
                </select>
                <input type="text"  placeholder="Your name"  value={name}  onChange={e => setName(e.target.value)}  style={inputCls} />
                <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} style={inputCls} required />
              </div>
              {/* Row 2 */}
              <div style={{ display: "flex", borderRadius: 999, border: "1.5px solid #1a1a2e", overflow: "hidden" }}>
                <input type="text" placeholder="How may I help you?" value={message} onChange={e => setMessage(e.target.value)} required
                  style={{ flex: 1, padding: "14px 22px", border: "none", background: "transparent", fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(13px,1.1vw,15px)", color: "#1a1a2e", outline: "none" }} />
                <button type="submit"
                  style={{ padding: "14px 22px", background: "#1a1a2e", border: "none", color: "#fff", fontSize: 16, cursor: "pointer", transition: "background .2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#155DFC"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1a1a2e"; }}>→</button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: "clamp(28px,4vw,48px)" }}>
            <span style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: "clamp(10px,.9vw,13px)", color: "#4A5565", letterSpacing: ".08em" }}>
              © 2026 MATHIAS BECERRA
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                  style={{
                    width: "clamp(32px,2.8vw,42px)", height: "clamp(32px,2.8vw,42px)",
                    borderRadius: "50%", background: "#101828",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    textDecoration: "none", transition: "transform .2s, background .2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.15)"; (e.currentTarget as HTMLElement).style.background = "#E7000B"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.background = "#101828"; }}
                >
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff">
                    <path d={s.svg} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Black footer bar — cohesion accent ── */}
      <div style={{
        background: "#0d0d0d",
        textAlign: "center",
        padding: "clamp(14px, 2vw, 22px) 20px",
      }}>
        <span style={{
          fontFamily: "var(--font-geist-sans), sans-serif",
          fontSize: "clamp(10px,.9vw,12px)",
          letterSpacing: ".2em",
          textTransform: "uppercase",
          color: "rgba(240,237,230,0.5)",
        }}>
          Designed &amp; built by Mathias Becerra
        </span>
      </div>
    </section>
  );
}
