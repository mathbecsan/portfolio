"use client";

import { useState } from "react";

export default function EighthScreen() {
  const [name,    setName]    = useState("");
  const [email,   setEmail]   = useState("");
  const [message, setMessage] = useState("");
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSending(true);
    // Opens default mail client with pre-filled content
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.open(`mailto:mathias@stanford.edu?subject=${subject}&body=${body}`);
    setTimeout(() => { setSent(true); setSending(false); }, 600);
  };

  return (
    <section style={{ background: "#0A0A0A", overflow: "hidden" }}>

      {/* ── Part 1: LET'S TALK layout from Figma ── */}
      <img
        src="/screen8/app.svg"
        alt="Let's Talk — contact section"
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      {/* ── Part 2: Interactive email form ── */}
      <div style={{
        background: "#0d0d0d",
        padding: "clamp(56px, 8vw, 100px) clamp(24px, 7vw, 120px)",
        display: "flex",
        flexWrap: "wrap",
        gap: "clamp(40px, 6vw, 80px)",
        alignItems: "flex-start",
      }}>

        {/* Left — headline */}
        <div style={{ flex: "1 1 280px", maxWidth: 420 }}>
          <div style={{ display: "flex", gap: 4, marginBottom: 20 }}>
            {["#E7000B","#F0B100","#1447E6"].map(c => (
              <div key={c} style={{ width: 5, height: 36, background: c, borderRadius: 2 }} />
            ))}
          </div>
          <h2 style={{
            fontFamily: "monospace", fontWeight: 900,
            fontSize: "clamp(32px, 5vw, 64px)",
            color: "#f0ede6", margin: "0 0 16px",
            lineHeight: 1, letterSpacing: "-0.02em",
          }}>
            SEND ME<br />AN EMAIL
          </h2>
          <p style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(13px, 1.3vw, 17px)",
            color: "rgba(240,237,230,0.55)",
            lineHeight: 1.7, margin: "0 0 28px",
          }}>
            Have a project, a question, or just want to connect?<br />
            I'd love to hear from you.
          </p>
          <a href="mailto:mathias@stanford.edu"
            style={{
              fontFamily: "monospace", fontSize: 13,
              color: "#E7000B", letterSpacing: "0.1em",
              textDecoration: "none", borderBottom: "1px solid #E7000B",
              paddingBottom: 2,
            }}>
            mathias@stanford.edu
          </a>
        </div>

        {/* Right — form */}
        <div style={{ flex: "1 1 320px", maxWidth: 540 }}>
          {sent ? (
            <div style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", height: 300, gap: 16, textAlign: "center",
            }}>
              <div style={{ fontSize: 48 }}>✉️</div>
              <p style={{ fontFamily: "monospace", fontSize: 16, color: "#f0ede6", margin: 0 }}>
                Mail client opened!
              </p>
              <p style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(240,237,230,0.4)", margin: 0 }}>
                Thank you — I'll get back to you soon.
              </p>
              <button onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
                style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: ".1em", color: "#E7000B", background: "none", border: "1px solid #E7000B", padding: "8px 20px", borderRadius: 3, cursor: "pointer", marginTop: 8 }}>
                SEND ANOTHER
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {[
                { label: "NAME",    value: name,    setter: setName,    type: "text",  placeholder: "Mathias Becerra" },
                { label: "EMAIL",   value: email,   setter: setEmail,   type: "email", placeholder: "you@example.com" },
              ].map(({ label, value, setter, type, placeholder }) => (
                <div key={label}>
                  <label style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".18em", color: "rgba(240,237,230,.4)", display: "block", marginBottom: 6 }}>
                    {label}
                  </label>
                  <input
                    type={type}
                    value={value}
                    onChange={e => setter(e.target.value)}
                    placeholder={placeholder}
                    required
                    style={{
                      width: "100%", padding: "12px 16px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 4, color: "#f0ede6",
                      fontFamily: "monospace", fontSize: 14,
                      outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: ".18em", color: "rgba(240,237,230,.4)", display: "block", marginBottom: 6 }}>
                  MESSAGE
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Tell me about your project, idea, or just say hi..."
                  required
                  rows={5}
                  style={{
                    width: "100%", padding: "12px 16px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: 4, color: "#f0ede6",
                    fontFamily: "monospace", fontSize: 14,
                    outline: "none", resize: "vertical",
                    boxSizing: "border-box",
                  }}
                />
              </div>
              <button type="submit" disabled={sending}
                style={{
                  fontFamily: "monospace", fontWeight: 700,
                  fontSize: 12, letterSpacing: ".18em",
                  color: "#f0ede6",
                  background: sending ? "#333" : "#E7000B",
                  border: "none", padding: "14px 28px",
                  borderRadius: 4, cursor: sending ? "not-allowed" : "pointer",
                  textTransform: "uppercase",
                  transition: "background .2s ease",
                  alignSelf: "flex-start",
                }}>
                {sending ? "OPENING MAIL..." : "SEND MESSAGE →"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── Part 3: Replicate / closing design ── */}
      <img
        src="/screen8/replicate.svg"
        alt="Let's Talk closing section"
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      {/* ── Footer ── */}
      <div style={{
        background: "#0A0A0A",
        padding: "clamp(20px, 3vw, 36px) clamp(24px, 6vw, 80px)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, background: "#2952A3", borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "monospace", fontWeight: 900, color: "#fff", fontSize: 10 }}>MB</span>
          </div>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(240,237,230,0.3)", letterSpacing: ".1em" }}>
            MATHIAS BECERRA-SANCHEZ © 2026
          </span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "GitHub",   href: "https://github.com/mathbecsan"                      },
            { label: "LinkedIn", href: "https://linkedin.com/in/mathiasbecerrasanchez"       },
            { label: "Email",    href: "mailto:mathias@stanford.edu"                         },
          ].map(({ label, href }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer"
              style={{ fontFamily: "monospace", fontSize: 11, color: "rgba(240,237,230,0.35)", letterSpacing: ".1em", textDecoration: "none" }}>
              {label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
