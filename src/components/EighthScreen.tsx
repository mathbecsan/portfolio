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

  const pill: React.CSSProperties = {
    padding: "13px 22px", borderRadius: 999,
    border: "1.5px solid rgba(255,255,255,0.25)",
    background: "rgba(255,255,255,0.06)",
    fontFamily: "Georgia, serif",
    fontSize: "clamp(13px, 1.1vw, 15px)",
    color: "#f0ede6", outline: "none",
    flex: "1 1 160px", minWidth: 0,
  };

  return (
    <section style={{ overflow: "hidden" }}>

      {/* ── Bauhaus top strip ── */}
      <div style={{ lineHeight: 0 }}>
        <img src="/screen7/bauhaus-top.svg" aria-hidden alt=""
          style={{ width: "100%", height: "clamp(80px,12vw,160px)", objectFit: "cover", objectPosition: "center top", display: "block" }} />
      </div>

      {/* ── Email marquee band ── */}
      <div style={{ background: "#F5E6C0", overflow: "hidden", padding: "clamp(24px,4vw,56px) 0" }}>
        <img src="/screen8/replicate.svg" alt="mathbecsan@gmail.com"
          style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      {/* ── LET'S TALK section ── */}
      <div style={{ background: "#0d0d0d", position: "relative", overflow: "hidden" }}>

        {/* Bauhaus corner decorations */}
        <img src="/second-screen/word-1.svg" aria-hidden alt=""
          style={{ position: "absolute", top: 0, left: 0, width: "clamp(70px,10vw,160px)", zIndex: 0 }} />
        <img src="/second-screen/word-4.svg" aria-hidden alt=""
          style={{ position: "absolute", top: 0, right: 0, height: "clamp(70px,10vw,150px)", width: "auto", zIndex: 0 }} />
        <img src="/second-screen/word-2.svg" aria-hidden alt=""
          style={{ position: "absolute", bottom: 0, left: 0, width: "clamp(100px,16vw,240px)", zIndex: 0 }} />
        <img src="/second-screen/word-3.svg" aria-hidden alt=""
          style={{ position: "absolute", bottom: 0, right: 0, width: "clamp(100px,16vw,240px)", zIndex: 0 }} />

        {/* Bauhaus color accent bars behind the title */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, display: "flex", zIndex: 1 }}>
          {["#E7000B","#F0B100","#155DFC","#E7000B","#F0B100","#155DFC","#E7000B","#F0B100","#155DFC","#E7000B"].map((c,i) => (
            <div key={i} style={{ flex: 1, background: c }} />
          ))}
        </div>

        <div style={{
          position: "relative", zIndex: 2,
          padding: "clamp(60px,9vw,110px) clamp(40px,8vw,120px) clamp(56px,8vw,100px)",
          display: "flex", flexWrap: "wrap", gap: "clamp(40px,6vw,80px)", alignItems: "flex-start",
        }}>

          {/* LEFT: heading + buttons */}
          <div style={{ flex: "1 1 280px", maxWidth: 420 }}>
            <h2 style={{
              fontFamily: "monospace", fontWeight: 900,
              fontSize: "clamp(52px,9vw,118px)",
              color: "#f0ede6", margin: "0 0 6px",
              lineHeight: .9, letterSpacing: "-.02em",
            }}>
              LET&apos;S<br />
              <span style={{ color: "#E7000B" }}>TALK</span>
            </h2>
            <p style={{
              fontFamily: "Georgia, serif", fontStyle: "italic",
              fontSize: "clamp(14px,1.4vw,18px)",
              color: "rgba(240,237,230,0.6)",
              lineHeight: 1.65, margin: "16px 0 32px",
            }}>
              Have a project in mind or just want to say hello? I&apos;d love to hear from you.
            </p>

            {/* Action buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              {[
                { label: "GitHub",          href: "https://github.com/mathbecsan",         bg: "#fff",    color: "#0d0d0d" },
                { label: "Book a Call",     href: "https://calendly.com/mathbecsan",       bg: "#155DFC", color: "#fff"    },
                { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/mathbecsan",   bg: "#E7000B", color: "#fff"    },
                { label: "Resume ↗",        href: "/resume.pdf",                           bg: "#F0B100", color: "#0d0d0d" },
              ].map(btn => (
                <a key={btn.label} href={btn.href} target="_blank" rel="noopener noreferrer"
                  style={{
                    padding: "10px 18px", borderRadius: 6,
                    background: btn.bg, color: btn.color,
                    fontFamily: "monospace", fontWeight: 700,
                    fontSize: "clamp(10px,.95vw,13px)", letterSpacing: ".06em",
                    textDecoration: "none", whiteSpace: "nowrap",
                    transition: "transform .18s, box-shadow .18s",
                    display: "inline-block",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 24px rgba(0,0,0,.35)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
                >{btn.label}</a>
              ))}
            </div>
          </div>

          {/* RIGHT: form */}
          <div style={{ flex: "1 1 300px", maxWidth: 520 }}>
            {sent ? (
              <div style={{ textAlign: "center", padding: "48px 0" }}>
                <p style={{ fontFamily: "monospace", fontSize: "clamp(28px,4vw,44px)", color: "#f0ede6", margin: "0 0 12px" }}>✉️</p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: 18, color: "#f0ede6", margin: "0 0 8px" }}>Mail client opened!</p>
                <p style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(240,237,230,.4)", margin: "0 0 20px" }}>I'll get back to you soon.</p>
                <button onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
                  style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: ".1em", background: "none", border: "1px solid rgba(240,237,230,.3)", padding: "10px 24px", borderRadius: 999, cursor: "pointer", color: "#f0ede6" }}>
                  SEND ANOTHER
                </button>
              </div>
            ) : (
              <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <select value={topic} onChange={e => setTopic(e.target.value)}
                  style={{ ...pill, cursor: "pointer", flex: "0 0 auto" } as React.CSSProperties}>
                  {TOPICS.map(t => <option key={t} value={t} style={{ background: "#1a1a1a" }}>{t}</option>)}
                </select>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <input type="text"  placeholder="Your name"  value={name}  onChange={e => setName(e.target.value)}  style={{ ...pill, flex: "1 1 140px" }} />
                  <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} style={{ ...pill, flex: "1 1 160px" }} required />
                </div>
                <div style={{ display: "flex", borderRadius: 999, border: "1.5px solid rgba(255,255,255,0.25)", overflow: "hidden", background: "rgba(255,255,255,0.06)" }}>
                  <input type="text" placeholder="How may I help you?" value={message} onChange={e => setMessage(e.target.value)} required
                    style={{ flex: 1, padding: "13px 22px", border: "none", background: "transparent", fontFamily: "Georgia, serif", fontSize: "clamp(13px,1.1vw,15px)", color: "#f0ede6", outline: "none" }} />
                  <button type="submit"
                    style={{ padding: "13px 22px", background: "#E7000B", border: "none", color: "#fff", fontSize: 16, cursor: "pointer", borderRadius: 0, transition: "background .2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "#155DFC"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "#E7000B"; }}>→</button>
                </div>
              </form>
            )}

            {/* Social + copyright */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginTop: 28 }}>
              <span style={{ fontFamily: "monospace", fontSize: "clamp(9px,.8vw,11px)", color: "rgba(240,237,230,.25)", letterSpacing: ".08em" }}>
                © 2026 MATHIAS BECERRA
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                {SOCIALS.map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                    style={{
                      width: "clamp(28px,2.5vw,36px)", height: "clamp(28px,2.5vw,36px)",
                      borderRadius: "50%", background: "#1a1a1a",
                      border: "1px solid rgba(255,255,255,.12)",
                      color: "#f0ede6", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "clamp(10px,1vw,13px)", fontFamily: "monospace",
                      textDecoration: "none", transition: "transform .2s, background .2s",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.15)"; (e.currentTarget as HTMLElement).style.background = "#E7000B"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.background = "#1a1a1a"; }}
                  >{s.icon}</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Bauhaus strip ── */}
      <div style={{ lineHeight: 0 }}>
        <img src="/screen7/bauhaus-top.svg" aria-hidden alt=""
          style={{ width: "100%", height: "clamp(80px,12vw,160px)", objectFit: "cover", objectPosition: "center top", display: "block", transform: "scaleY(-1)" }} />
      </div>
    </section>
  );
}
