"use client";

import { useState } from "react";

const TOPICS  = ["Mentoring", "Collaboration", "Freelance", "Research", "Just saying hi!"];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/mathbecsan",              svg: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { label: "Dribbble",  href: "https://dribbble.com/mathbecsan",               svg: "M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.07.02c-5.79 2.015-7.888 6.083-8.06 6.43 1.725 1.34 3.9 2.14 6.27 2.14 1.42 0 2.77-.29 4.05-.82zm-9.565-1.477c.22-.37 2.794-4.647 8.065-6.352.026-.01.05-.01.075-.02-.268-.6-.56-1.2-.867-1.792C8.02 12.89 2.519 12.976 2.069 12.982c0 .156-.006.312-.006.47 0 2.46.942 4.71 2.48 6.403zM2.14 11.503c.457.006 5.19-.026 10.02-2.38-.957-1.7-1.98-3.13-2.14-3.35-2.91 1.376-5.064 3.842-5.74 6.73zM11.01 5.02c.165.22 1.21 1.65 2.15 3.375 2.05-.77 2.93-1.94 3.04-2.085C14.67 4.83 13.4 4.25 12 4.25c-.347 0-.687.03-1.02.07h.03z" },
  { label: "Behance",   href: "https://behance.net/mathbecsan",                svg: "M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.48.715 2.34 1.91 2.34 1.17 0 1.5-.617 1.78-1.31l3.066 1zm-5.64-5.51c-.108-1.29-.815-1.99-1.78-1.99-1.064 0-1.73.687-1.89 1.99h3.67zm-11.08 6.34H4.06V7.5H7c2.63 0 4.56.8 4.56 3.33 0 1.27-.61 2.32-1.77 2.88v.03c1.45.39 2.36 1.49 2.36 3.06 0 2.97-2.18 4.03-4.95 4.03zM6.2 10.65h1.04c1.17 0 1.76-.54 1.76-1.54 0-1.01-.59-1.53-1.76-1.53H6.2v3.07zm0 5.6h1.3c1.19 0 1.98-.62 1.98-1.73 0-1.08-.76-1.73-1.93-1.73H6.2v3.46z" },
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
    background: "transparent", fontFamily: "Georgia, serif",
    fontSize: "clamp(13px,1.1vw,15px)", color: "#1a1a2e",
    outline: "none", minWidth: 0,
  };

  return (
    <section id="contact">

      {/* ── Big email ── */}
      <div style={{ background: "#F5E6C0", textAlign: "center", padding: "clamp(32px,5vw,64px) 20px", lineHeight: 1 }}>
        <a href="mailto:mathbecsan@gmail.com" style={{
          fontFamily: "Georgia, 'Times New Roman', serif",
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
              fontFamily: "monospace", fontWeight: 900,
              fontSize: "clamp(56px,10vw,130px)",
              color: "#0d0d0d", margin: 0,
              lineHeight: .88, letterSpacing: "-.02em",
              flexShrink: 0,
            }}>
              LET&apos;S<br /><span style={{ color: "#E7000B" }}>TALK</span>
            </h2>
            <p style={{
              fontFamily: "Georgia, serif",
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
            ].map(b => (
              <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer"
                style={{
                  padding: "11px 22px", borderRadius: 6,
                  border: `2px solid ${b.border}`,
                  background: b.bg, color: b.color,
                  fontFamily: "monospace", fontWeight: 700,
                  fontSize: "clamp(10px, 1vw, 13px)", letterSpacing: ".08em",
                  textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6,
                  transition: "transform .18s, box-shadow .18s",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,0,0,.15)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
              >
                {b.icon && <span>{b.icon}</span>}{b.label}
              </a>
            ))}
          </div>

          {/* Form */}
          {sent ? (
            <div style={{ padding: "24px 0" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#1a1a2e", margin: "0 0 12px" }}>✉️ Mail client opened — talk soon!</p>
              <button onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
                style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: ".1em", background: "none", border: "1.5px solid #1a1a2e", padding: "9px 22px", borderRadius: 999, cursor: "pointer", color: "#1a1a2e" }}>
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
                  style={{ flex: 1, padding: "14px 22px", border: "none", background: "transparent", fontFamily: "Georgia, serif", fontSize: "clamp(13px,1.1vw,15px)", color: "#1a1a2e", outline: "none" }} />
                <button type="submit"
                  style={{ padding: "14px 22px", background: "#1a1a2e", border: "none", color: "#fff", fontSize: 16, cursor: "pointer", transition: "background .2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#155DFC"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1a1a2e"; }}>→</button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: "clamp(28px,4vw,48px)" }}>
            <span style={{ fontFamily: "monospace", fontSize: "clamp(10px,.9vw,13px)", color: "#4A5565", letterSpacing: ".08em" }}>
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
    </section>
  );
}
