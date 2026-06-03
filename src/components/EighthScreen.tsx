"use client";

import { useState } from "react";

const SOCIALS = [
  { icon: "📷", label: "Instagram", href: "https://instagram.com/mathbecsan"              },
  { icon: "🏀", label: "Dribbble",  href: "https://dribbble.com/mathbecsan"               },
  { icon: "Bē", label: "Behance",   href: "https://behance.net/mathbecsan"                },
  { icon: "📌", label: "Pinterest", href: "https://pinterest.com/mathbecsan"              },
  { icon: "💬", label: "WhatsApp",  href: "https://wa.me/message/mathbecsan"              },
  { icon: "in", label: "LinkedIn",  href: "https://linkedin.com/in/mathiasbecerrasanchez" },
];

const TOPICS = ["Mentoring", "Collaboration", "Freelance", "Research", "Just saying hi!"];

export default function EighthScreen() {
  const [topic,   setTopic]   = useState("Mentoring");
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [sent,    setSent]    = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[${topic}] from ${name || "Portfolio visitor"}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.open(`mailto:mathbecsan@gmail.com?subject=${subject}&body=${body}`);
    setSent(true);
  };

  const inputStyle: React.CSSProperties = {
    flex: "1 1 180px",
    padding: "14px 20px",
    borderRadius: 999,
    border: "1.5px solid #1a1a2e",
    background: "transparent",
    fontFamily: "Georgia, serif",
    fontSize: "clamp(13px, 1.2vw, 15px)",
    color: "#1a1a2e",
    outline: "none",
    minWidth: 0,
  };

  return (
    <section style={{ background: "#FFE4B4", overflow: "hidden" }}>

      {/* ── 1. Big email display (replicate.svg) ── */}
      <img
        src="/screen8/replicate.svg"
        alt="mathbecsan@gmail.com"
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      {/* ── 2. Let's Talk form (coded to match Figma, all buttons clickable) ── */}
      <div style={{
        padding: "clamp(32px, 5vw, 60px) clamp(24px, 7vw, 120px) clamp(40px, 6vw, 72px)",
        maxWidth: 1200,
        margin: "0 auto",
      }}>

        {/* Button row */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, marginBottom: "clamp(24px, 4vw, 40px)" }}>
          <a href="https://github.com/mathbecsan" target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 22px", borderRadius: 6,
              border: "2px solid #1a1a2e", background: "#fff",
              fontFamily: "monospace", fontWeight: 700,
              fontSize: "clamp(11px, 1.1vw, 14px)", letterSpacing: ".08em",
              color: "#1a1a2e", textDecoration: "none",
              transition: "transform .18s ease, box-shadow .18s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(0,0,0,.15)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
            GITHUB
          </a>

          <a href="https://calendly.com/mathbecsan" target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 22px", borderRadius: 6,
              background: "#155DFC", border: "2px solid #155DFC",
              fontFamily: "monospace", fontWeight: 700,
              fontSize: "clamp(11px, 1.1vw, 14px)", letterSpacing: ".08em",
              color: "#fff", textDecoration: "none",
              transition: "transform .18s ease, box-shadow .18s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(21,93,252,.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
          >
            📅 BOOK A CALL
          </a>

          <a href="https://buymeacoffee.com/mathbecsan" target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 22px", borderRadius: 6,
              background: "#E7000B", border: "2px solid #E7000B",
              fontFamily: "monospace", fontWeight: 700,
              fontSize: "clamp(11px, 1.1vw, 14px)", letterSpacing: ".08em",
              color: "#fff", textDecoration: "none",
              transition: "transform .18s ease, box-shadow .18s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 20px rgba(231,0,11,.4)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
          >
            ☕ BUY ME A COFFEE
          </a>

          <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              fontFamily: "monospace", fontWeight: 700,
              fontSize: "clamp(13px, 1.3vw, 17px)", letterSpacing: ".06em",
              color: "#F0B100", textDecoration: "none",
              transition: "opacity .18s ease",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = ".7"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >
            RESUME ←
          </a>
        </div>

        {/* Form */}
        {sent ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <p style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#1a1a2e", margin: "0 0 12px" }}>✉️ Mail client opened!</p>
            <p style={{ fontFamily: "monospace", fontSize: 13, color: "#4A5565", margin: "0 0 20px" }}>Thanks — I'll get back to you soon.</p>
            <button onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
              style={{ fontFamily: "monospace", fontSize: 12, letterSpacing: ".1em", background: "none", border: "1.5px solid #1a1a2e", padding: "10px 24px", borderRadius: 999, cursor: "pointer", color: "#1a1a2e" }}>
              SEND ANOTHER
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend}>
            {/* Row 1: topic + name + email */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 12 }}>
              <select value={topic} onChange={e => setTopic(e.target.value)}
                style={{ ...inputStyle, flex: "0 1 200px", cursor: "pointer" }}>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)}
                style={inputStyle} />
              <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)}
                required style={inputStyle} />
            </div>

            {/* Row 2: message + send button */}
            <div style={{ display: "flex", gap: 0, borderRadius: 999, border: "1.5px solid #1a1a2e", overflow: "hidden" }}>
              <input type="text" placeholder="How may I help you?" value={message}
                onChange={e => setMessage(e.target.value)} required
                style={{
                  flex: 1, padding: "14px 24px", border: "none", background: "transparent",
                  fontFamily: "Georgia, serif", fontSize: "clamp(13px, 1.2vw, 15px)",
                  color: "#1a1a2e", outline: "none",
                }} />
              <button type="submit"
                style={{
                  padding: "14px 22px", background: "#1a1a2e", border: "none",
                  color: "#fff", fontSize: 18, cursor: "pointer",
                  borderRadius: 0, transition: "background .2s ease",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#155DFC"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1a1a2e"; }}
              >
                →
              </button>
            </div>
          </form>
        )}

        {/* Footer */}
        <div style={{
          display: "flex", flexWrap: "wrap",
          justifyContent: "space-between", alignItems: "center",
          marginTop: "clamp(28px, 4vw, 48px)", gap: 16,
        }}>
          <span style={{ fontFamily: "monospace", fontSize: 13, color: "#4A5565", letterSpacing: ".06em" }}>
            © 2026 MATHIAS BECERRA
          </span>
          <div style={{ display: "flex", gap: 10 }}>
            {SOCIALS.map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                title={s.label}
                style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "#101828", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, fontWeight: 700, fontFamily: "monospace",
                  textDecoration: "none", transition: "transform .2s ease, background .2s ease",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.12)"; (e.currentTarget as HTMLElement).style.background = "#155DFC"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.background = "#101828"; }}
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
