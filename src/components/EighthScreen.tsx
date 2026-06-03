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
    flex: "1 1 180px", padding: "13px 20px",
    borderRadius: 999, border: "1.5px solid #1a1a2e",
    background: "rgba(255,255,255,0.55)", backdropFilter: "blur(4px)",
    fontFamily: "Georgia, serif", fontSize: "clamp(13px, 1.1vw, 15px)",
    color: "#1a1a2e", outline: "none", minWidth: 0,
  };

  return (
    <section style={{ background: "#FFE4B4", overflow: "hidden" }}>

      {/* ── Bauhaus top strip ── */}
      <div style={{ lineHeight: 0 }}>
        <img src="/screen7/bauhaus-top.svg" aria-hidden alt=""
          style={{ width: "100%", height: "clamp(80px, 11vw, 150px)", objectFit: "cover", objectPosition: "center top", display: "block" }} />
      </div>

      {/* ── Big email display ── */}
      <div style={{ position: "relative" }}>
        <img src="/screen8/replicate.svg" alt="mathbecsan@gmail.com"
          style={{ width: "100%", height: "auto", display: "block" }} />
        {/* Corner Bauhaus decorations over the email display */}
        <img src="/second-screen/word-1.svg" aria-hidden alt=""
          style={{ position: "absolute", top: 0, left: 0, width: "clamp(60px, 9vw, 140px)", zIndex: 2 }} />
        <img src="/second-screen/word-4.svg" aria-hidden alt=""
          style={{ position: "absolute", top: 0, right: 0, height: "clamp(60px, 9vw, 120px)", width: "auto", zIndex: 2 }} />
      </div>

      {/* ── Let's Talk section — app.svg as Bauhaus frame + interactive form on top ── */}
      <div style={{ position: "relative" }}>
        {/* Bauhaus frame from Figma export */}
        <img src="/screen8/app.svg" aria-hidden alt=""
          style={{ width: "100%", height: "auto", display: "block" }} />

        {/* Interactive form overlay — centered in the cream middle area of app.svg */}
        {/* app.svg is 2118×915; cream area runs roughly y=8%–82% */}
        <div style={{
          position: "absolute",
          top: "8%", left: "14%", right: "14%",
          bottom: "18%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "clamp(10px, 1.4vw, 18px)",
          zIndex: 2,
        }}>
          {/* Buttons row */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(8px, 1vw, 14px)" }}>
            {[
              { label: "⊞ GITHUB",        href: "https://github.com/mathbecsan",         bg: "#fff",     border: "#1a1a2e", color: "#1a1a2e" },
              { label: "📅 BOOK A CALL",  href: "https://calendly.com/mathbecsan",       bg: "#155DFC",  border: "#155DFC", color: "#fff"    },
              { label: "☕ BUY ME A COFFEE", href: "https://buymeacoffee.com/mathbecsan", bg: "#E7000B",  border: "#E7000B", color: "#fff"    },
            ].map(btn => (
              <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
                style={{
                  padding: "clamp(8px,1vw,12px) clamp(14px,1.8vw,22px)",
                  borderRadius: 6, border: `2px solid ${btn.border}`,
                  background: btn.bg, color: btn.color,
                  fontFamily: "monospace", fontWeight: 700,
                  fontSize: "clamp(9px, 0.95vw, 13px)", letterSpacing: ".06em",
                  textDecoration: "none", whiteSpace: "nowrap",
                  transition: "transform .18s, box-shadow .18s",
                  display: "inline-block",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 6px 18px rgba(0,0,0,.18)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
              >{btn.label}</a>
            ))}
            <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"
              style={{
                padding: "clamp(8px,1vw,12px) clamp(14px,1.8vw,22px)",
                fontFamily: "monospace", fontWeight: 700,
                fontSize: "clamp(9px, 0.95vw, 13px)", letterSpacing: ".06em",
                color: "#F0B100", textDecoration: "none", whiteSpace: "nowrap",
                transition: "opacity .18s",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = ".7"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
            >RESUME ←</a>
          </div>

          {/* Form */}
          {sent ? (
            <div style={{ textAlign: "center", padding: "12px 0" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(15px,1.6vw,20px)", color: "#1a1a2e", margin: "0 0 8px" }}>✉️ Mail client opened!</p>
              <button onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
                style={{ fontFamily: "monospace", fontSize: "clamp(9px,.9vw,11px)", letterSpacing: ".1em", background: "none", border: "1.5px solid #1a1a2e", padding: "8px 20px", borderRadius: 999, cursor: "pointer", color: "#1a1a2e" }}>
                SEND ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 1vw, 14px)" }}>
              {/* Row 1 */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "clamp(6px,.8vw,12px)" }}>
                <select value={topic} onChange={e => setTopic(e.target.value)}
                  style={{ ...inputStyle, flex: "0 1 160px", cursor: "pointer" }}>
                  {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <input type="text" placeholder="Your name" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
                <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
              </div>
              {/* Row 2 */}
              <div style={{ display: "flex", borderRadius: 999, border: "1.5px solid #1a1a2e", overflow: "hidden", background: "rgba(255,255,255,0.55)" }}>
                <input type="text" placeholder="How may I help you?" value={message}
                  onChange={e => setMessage(e.target.value)} required
                  style={{ flex: 1, padding: "13px 22px", border: "none", background: "transparent", fontFamily: "Georgia, serif", fontSize: "clamp(13px,1.1vw,15px)", color: "#1a1a2e", outline: "none" }} />
                <button type="submit"
                  style={{ padding: "13px 20px", background: "#1a1a2e", border: "none", color: "#fff", fontSize: 16, cursor: "pointer", transition: "background .2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#155DFC"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#1a1a2e"; }}
                >→</button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10, marginTop: 2 }}>
            <span style={{ fontFamily: "monospace", fontSize: "clamp(9px,.85vw,12px)", color: "#4A5565", letterSpacing: ".06em" }}>
              © 2026 MATHIAS BECERRA
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                  style={{
                    width: "clamp(28px,2.8vw,40px)", height: "clamp(28px,2.8vw,40px)",
                    borderRadius: "50%", background: "#101828", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "clamp(10px,1.1vw,14px)", fontWeight: 700, fontFamily: "monospace",
                    textDecoration: "none", transition: "transform .2s, background .2s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.15)"; (e.currentTarget as HTMLElement).style.background = "#155DFC"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.background = "#101828"; }}
                >{s.icon}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bauhaus bottom strip ── */}
      <div style={{ lineHeight: 0 }}>
        <img src="/second-screen/word-2.svg" aria-hidden alt=""
          style={{ width: "clamp(120px,20vw,300px)", height: "auto", display: "inline-block", verticalAlign: "bottom" }} />
        <img src="/second-screen/word-3.svg" aria-hidden alt=""
          style={{ width: "clamp(120px,20vw,300px)", height: "auto", display: "inline-block", verticalAlign: "bottom", float: "right" }} />
      </div>
    </section>
  );
}
