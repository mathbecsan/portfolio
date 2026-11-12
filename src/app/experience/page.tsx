"use client";
import { useState, type MouseEvent } from "react";
import BauhausScrollOrnament from "@/components/BauhausScrollOrnament";
import SiteNav from "@/components/SiteNav";
import { SOCIALS, TOPICS } from "@/components/EighthScreen";


// Topics and social links are shared with the homepage contact section and /contact.


const VIDEO_CARDS = [
  { src: "/experience-screen5/link-1.svg", label: "Polyglot Science",          accent: "#FBBF24", url: "https://youtu.be/ejLeOqRVCW0" },
  { src: "/experience-screen5/link-2.svg", label: "Quechua Transcreation",     accent: "#E31E24", url: "https://www.youtube.com/watch?v=ROownOToAvk" },
  { src: "/experience-screen5/link-3.svg", label: "Full-ride Scholarship",     accent: "#005CAA", url: "https://www.youtube.com/watch?v=WGzLBY6mQx0" },
  { src: "/experience-screen5/link-4.svg", label: "Entrevista Becarios",       accent: "#FBBF24", url: "https://www.youtube.com/watch?v=wlxoo4pVtw4" },
  { src: "/experience-screen5/link-5.svg", label: "Pregrado en el Extranjero", accent: "#E31E24", url: "https://www.youtube.com/watch?v=ywOGJ8Qfo1o" },
  { src: "/experience-screen5/link-6.svg", label: "Abundant Technologies",     accent: "#005CAA", url: "https://www.youtube.com/watch?v=1FEWTn7qaqk" },
];

export default function ExperiencePage() {
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
    <main
      style={{
        background: "#FFF3DE",
        minHeight: "100vh",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BauhausScrollOrnament />

      <SiteNav current="Experience" />

      {/* ── Top Bauhaus Strip (small) ── */}
      <div
        style={{ width: "100%", overflow: "hidden", lineHeight: 0, paddingTop: "var(--site-nav-h)", maxHeight: "calc(var(--site-nav-h) + 62px)",
          transition: "filter 0.3s ease, transform 0.3s ease", cursor: "default" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.08) saturate(1.15)"; (e.currentTarget as HTMLElement).style.transform = "scaleY(1.04)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = ""; (e.currentTarget as HTMLElement).style.transform = ""; }}
      >
        <img loading="lazy" decoding="async" src="/experience-screen1/group-4.svg" alt="" style={{ width: "100%", height: "120px", objectFit: "cover", objectPosition: "top", display: "block" }} />
      </div>

      {/* ── Center Content ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(40px, 6vw, 80px) clamp(40px, 8vw, 140px)",
          gap: 20,
        }}
      >
        {/* Download My Resume */}
        <button
          type="button"
          onClick={() => alert("Request via email")}
          style={{ display: "block", textDecoration: "none", maxWidth: 760, transition: "transform 0.2s ease, filter 0.2s ease", background: "none", border: "none", padding: 0, cursor: "pointer" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px) scale(1.02)"; (e.currentTarget as HTMLElement).style.filter = "drop-shadow(0 8px 24px rgba(230,51,41,0.35))"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.filter = ""; }}
        >
          <img loading="lazy" decoding="async"
            src="/experience-screen1/download-resume.svg"
            alt="Download My Resume"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </button>

        {/* Hire Me + Arrow row */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a
            href="mailto:mathbecsan@gmail.com"
            style={{ display: "block", textDecoration: "none", maxWidth: 240, transition: "transform 0.2s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px) scale(1.04)"; (e.currentTarget as HTMLElement).style.filter = "drop-shadow(0 8px 20px rgba(59,130,246,0.4))"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.filter = ""; }}
          >
            <img loading="lazy" decoding="async"
              src="/experience-screen1/hire-me.svg"
              alt="Hire Me!"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </a>
          <img loading="lazy" decoding="async"
            src="/experience-screen1/arrow-circle.svg"
            alt=""
            style={{ width: 80, height: 80, display: "block", cursor: "pointer", transition: "transform 0.25s ease, filter 0.25s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "rotate(-20deg) scale(1.15)"; (e.currentTarget as HTMLElement).style.filter = "drop-shadow(0 4px 12px rgba(31,41,55,0.25))"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.filter = ""; }}
          />
        </div>
      </div>

      {/* ── Bottom Bauhaus Strip ── */}
      <div
        style={{
          width: "100%",
          overflow: "hidden",
          lineHeight: 0,
          maxHeight: 120,
        }}
      >
        <img loading="lazy" decoding="async"
          src="/experience-screen1/group-1.svg"
          alt=""
          style={{
            width: "100%",
            height: "120px",
            objectFit: "cover",
            objectPosition: "top",
            display: "block",
          }}
        />
      </div>

      {/* ── Interim: Work Experience Timeline ── */}
      <div
        style={{
          width: "100%",
          background: "#FFF3DE",
          padding: "clamp(40px, 5vw, 60px) 0",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <img loading="lazy" decoding="async"
          src="/experience-interim/work-experience-timeline.svg"
          alt="Work Experience Timeline"
          style={{ width: "78%", height: "auto", display: "block" }}
        />
      </div>

      {/* ── Screen 2: Top Bauhaus Strips ── */}
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0 }}>
        <img loading="lazy" decoding="async"
          src="/experience-screen2/group-4.svg"
          alt=""
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      {/* ── Screen 2: Timeline ── */}
      <div style={{ width: "100%", background: "#FFF3DE", padding: "clamp(30px, 5vw, 200px) 0", overflowX: "auto" }}>
        <img loading="lazy" decoding="async"
          src="/experience-screen2/timeline-4e99a868.svg"
          alt="Work Experience Timeline"
          style={{ width: "135%", minWidth: 1100, height: "auto", display: "block", marginLeft: "3%" }}
        />
      </div>

      {/* ── Interim 4–5: Media Releases ── */}
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0 }}>
        <img loading="lazy" decoding="async" src="/experience-interim45/group.svg" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
      <div style={{ width: "100%", background: "#FFF3DE", padding: "clamp(32px, 5vw, 60px) 0", display: "flex", justifyContent: "flex-start" }}>
        <img loading="lazy" decoding="async" src="/experience-interim45/media-releases.svg" alt="Media Releases" style={{ width: "55%", height: "auto", display: "block" }} />
      </div>
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0, transform: "scaleY(-1)" }}>
        <img loading="lazy" decoding="async" src="/experience-interim45/group-1.svg" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      {/* ── Screen 5: Video Interviews & Presentations ── */}
      <style>{`
        .video-card { position: relative; overflow: hidden; cursor: pointer; border-radius: 4px; }
        .video-card img { width: 100%; height: auto; display: block; transition: transform 0.3s ease; }
        .video-card:hover img { transform: scale(1.03); }
        .video-card .vc-overlay {
          position: absolute; inset: 0;
          background: rgba(0,0,0,0);
          transition: background 0.3s ease;
          pointer-events: none;
        }
        .video-card:hover .vc-overlay { background: rgba(0,0,0,0.18); }
      `}</style>

      <div style={{ width: "100%", background: "#FFF3DE", padding: "clamp(40px, 5vw, 72px) clamp(24px, 6vw, 80px) clamp(48px, 6vw, 80px)" }}>

        {/* Header */}
        <div style={{ marginBottom: "clamp(24px, 3vw, 40px)" }}>
          <img loading="lazy" decoding="async" src="/experience-screen5/header.svg" alt="Video Interviews & Presentations"
            style={{ width: "clamp(320px, 70%, 780px)", height: "auto", display: "block" }} />
        </div>

        {/* 3×2 grid of video cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(12px, 2vw, 24px)" }}>
          {VIDEO_CARDS.map((card) => (
            <a key={card.url} href={card.url} target="_blank" rel="noopener noreferrer"
              className="video-card"
              style={{ display: "block", textDecoration: "none" }}
            >
              <img loading="lazy" decoding="async" src={card.src} alt={card.label} />
              <div className="vc-overlay" />
            </a>
          ))}
        </div>

      </div>

      {/* ── Interim 5–6: Press Features ── */}
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0 }}>
        <img loading="lazy" decoding="async" src="/experience-interim56/group.svg" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
      <div style={{ width: "100%", background: "#FFF3DE", padding: "clamp(32px, 5vw, 60px) 0", display: "flex", justifyContent: "flex-end" }}>
        <img loading="lazy" decoding="async" src="/experience-interim56/press-features.svg" alt="Press Features" style={{ width: "55%", height: "auto", display: "block" }} />
      </div>
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0, transform: "scaleY(-1)" }}>
        <img loading="lazy" decoding="async" src="/experience-interim56/group-1.svg" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      {/* ── Screen 6: Press Features ── */}
      <style>{`
        .press-card {
          display: block; text-decoration: none; cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
          border-radius: 6px; overflow: hidden;
        }
        .press-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 16px 40px rgba(0,0,0,0.15);
          filter: brightness(1.04);
        }
        .press-card img { width: 100%; height: auto; display: block; transition: transform 0.3s ease; }
        .press-card:hover img { transform: scale(1.03); }
        .press-header {
          transition: filter 0.25s ease, transform 0.25s ease;
          cursor: default;
        }
        .press-header:hover { filter: brightness(1.06) saturate(1.1); transform: scale(1.01); }
      `}</style>

      <div style={{ width: "100%", background: "#F5F1E8", padding: "clamp(40px, 5vw, 72px) clamp(24px, 6vw, 80px)" }}>

        {/* Two-column top section */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(24px, 4vw, 48px)", marginBottom: "clamp(40px, 5vw, 64px)" }}>

          {/* Left — Website Featurings */}
          <div>
            <img loading="lazy" decoding="async" src="/experience-screen6/websitefeaturings.svg" alt="Website Featurings" className="press-header" style={{ width: "100%", height: "auto", display: "block", marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <a href="https://abundant-intelligences.net/news/redefining-digital-inclusion-from-peru-to-the-world-virtual-talk-with-mathias-becerra-sanchez/" target="_blank" rel="noopener noreferrer" className="press-card"><img loading="lazy" decoding="async" src="/experience-screen6/abundantintelligences.svg" alt="Redefining Digital Inclusion" /></a>
              <a href="https://undergradresearch.stanford.edu/people/mathias-becerra-sanchez" target="_blank" rel="noopener noreferrer" className="press-card"><img loading="lazy" decoding="async" src="/experience-screen6/vpuefellowundergraduateresearch.svg" alt="Undergraduate Research Profile" /></a>
              <a href="https://silicon.stanford.edu/2025-silicon-unicode-interns/" target="_blank" rel="noopener noreferrer" className="press-card"><img loading="lazy" decoding="async" src="/experience-screen6/siliconunicode.svg" alt="Silicon Unicode Interns 2025" /></a>
              <a href="https://www.ampglobalyouth.org/global-youth-visionaries/" target="_blank" rel="noopener noreferrer" className="press-card"><img loading="lazy" decoding="async" src="/experience-screen6/globalyouthvisionares.svg" alt="Global Youth Visionaries" /></a>
            </div>
          </div>

          {/* Right — Social Media Featurings */}
          <div>
            <img loading="lazy" decoding="async" src="/experience-screen6/SocialMediaFeaturing.svg" alt="Social Media Featurings" className="press-header" style={{ width: "100%", height: "auto", display: "block", marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Instagram header + LinkedIn header */}
              <img loading="lazy" decoding="async" src="/experience-screen6/Instagram.svg" alt="Instagram" style={{ width: "100%", height: "auto", display: "block" }} />
              <img loading="lazy" decoding="async" src="/experience-screen6/Linkedin.svg" alt="LinkedIn" style={{ width: "100%", height: "auto", display: "block" }} />
              {/* Instagram posts */}
              <a href="https://www.instagram.com/p/DQuISp-EREc/" target="_blank" rel="noopener noreferrer" className="press-card"><img loading="lazy" decoding="async" src="/experience-screen6/scienceclubsinternational.svg" alt="Science Clubs International" /></a>
              <a href="https://www.linkedin.com/posts/tsmullaney_new-white-paper-over-6000-of-the-activity-7432847139535241216-dw5x" target="_blank" rel="noopener noreferrer" className="press-card"><img loading="lazy" decoding="async" src="/experience-screen6/HAIpaper.svg" alt="HAI Paper Acknowledgment" /></a>
              <a href="https://www.instagram.com/p/DXq0wv6G6nv/" target="_blank" rel="noopener noreferrer" className="press-card"><img loading="lazy" decoding="async" src="/experience-screen6/stanfordperuVSO.svg" alt="Stanford Peru VSO" /></a>
              <a href="https://www.linkedin.com/feed/update/urn:li:activity:7439346856062693376/" target="_blank" rel="noopener noreferrer" className="press-card"><img loading="lazy" decoding="async" src="/experience-screen6/africacenterfellows.svg" alt="Africa Center Fellows" /></a>
              <a href="https://www.instagram.com/abundantintelligences/" target="_blank" rel="noopener noreferrer" className="press-card"><img loading="lazy" decoding="async" src="/experience-screen6/abundanttechnologies.svg" alt="Abundant Technologies" /></a>
              <a href="https://www.linkedin.com/feed/update/urn:li:activity:7439375355313844225/" target="_blank" rel="noopener noreferrer" className="press-card"><img loading="lazy" decoding="async" src="/experience-screen6/Mwirelabs.svg" alt="MWIRE Labs" /></a>
            </div>
          </div>

        </div>

        {/* Articles & Publications */}
        <img loading="lazy" decoding="async" src="/experience-screen6/articlesandpublications.svg" alt="Articles & Publications" className="press-header" style={{ width: "100%", height: "auto", display: "block", marginBottom: 24 }} />
        <a href="https://drclas.harvard.edu/revista" target="_blank" rel="noopener noreferrer" className="press-card" style={{ maxWidth: 700 }}>
          <img loading="lazy" decoding="async" src="/experience-screen6/harvardarticle.svg" alt="Harvard DRCLAS Revista" />
        </a>

      </div>

      {/* ── Screen 8: Contact (same as home) ── */}
      <div style={{ background: "#F5E6C0", textAlign: "center", padding: "clamp(32px,5vw,64px) 20px", lineHeight: 1 }}>
        <a href="mailto:mathbecsan@gmail.com" style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: "clamp(28px,6vw,88px)", fontWeight: 700, color: "#364153", textDecoration: "none", letterSpacing: "-.02em", transition: "color .2s" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#E7000B"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#364153"; }}>
          mathbecsan@gmail.com
        </a>
      </div>

      <div style={{ height: "clamp(90px, 12vw, 155px)", backgroundImage: "url('/bauhaus-pattern.svg')", backgroundSize: "cover", backgroundPosition: "center top" }} />

      <div style={{ background: "#FFE4B4", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, width: "clamp(100px,16vw,240px)", height: "clamp(100px,16vw,240px)", background: "#E7000B", borderRadius: "0 0 100% 0", zIndex: 0 }} />
        <div style={{ position: "absolute", top: 0, right: 0, zIndex: 0, display: "flex", alignItems: "stretch" }}>
          <div style={{ width: "clamp(60px,8vw,120px)", background: "#E7000B" }} />
          <div style={{ width: "clamp(120px,18vw,280px)", background: "#155DFC", position: "relative", paddingBottom: "clamp(120px,18vw,280px)" }}>
            <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "62%", height: "62%", borderRadius: "50%", background: "#F0B100", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "38%", height: "38%", borderRadius: "50%", background: "#0d0d0d" }} />
            </div>
          </div>
        </div>
        <img loading="lazy" decoding="async" src="/second-screen/word-2.svg" aria-hidden alt="" style={{ position: "absolute", bottom: 0, left: 0, width: "clamp(80px,14vw,220px)", zIndex: 0 }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "clamp(56px,8vw,100px) clamp(28px,6vw,80px) clamp(48px,7vw,80px)" }}>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "clamp(24px,4vw,56px)", marginBottom: "clamp(24px,4vw,40px)" }}>
            <h2 style={{ fontFamily: "monospace", fontWeight: 900, fontSize: "clamp(56px,10vw,130px)", color: "#0d0d0d", margin: 0, lineHeight: .88, letterSpacing: "-.02em", flexShrink: 0 }}>
              LET&apos;S<br /><span style={{ color: "#E7000B" }}>TALK</span>
            </h2>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(16px,1.8vw,24px)", color: "#364153", lineHeight: 1.6, margin: "clamp(8px,1vw,16px) 0 0", maxWidth: 380, flex: "1 1 220px" }}>
              Have a project in mind or just want to say hello?<br />I&apos;d love to hear from you.
            </p>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: "clamp(20px,3vw,36px)" }}>
            {[
              { label: "GITHUB",          href: "https://github.com/mathbecsan",       bg: "#fff",    border: "#1a1a2e", color: "#1a1a2e", hoverBg: "#1a1a2e", hoverColor: "#fff",    icon: "⊞" },
              { label: "BOOK A CALL",     href: "https://calendly.com/mathbecsan",     bg: "#155DFC", border: "#155DFC", color: "#fff",    hoverBg: "#0d47d9", hoverColor: "#fff",    icon: "📅" },
              { label: "BUY ME A COFFEE", href: "https://buymeacoffee.com/mathbecsan", bg: "#E7000B", border: "#E7000B", color: "#fff",    hoverBg: "#c00",    hoverColor: "#fff",    icon: "☕" },
              { label: "RESUME →",        href: "",                                   bg: "#F0B100", border: "#F0B100", color: "#1a1a2e", hoverBg: "#d49e00", hoverColor: "#1a1a2e", icon: "↗" },
            ].map(b => {
              const sharedProps = {
                style: { padding: "11px 22px", borderRadius: 6, border: `2px solid ${b.border}`, background: b.bg, color: b.color, fontFamily: "monospace", fontWeight: 700, fontSize: "clamp(10px, 1vw, 13px)", letterSpacing: ".08em", textDecoration: "none", display: "inline-flex" as const, alignItems: "center" as const, gap: 6, transition: "transform .18s, box-shadow .18s, background .18s, color .18s", cursor: "pointer" },
                onMouseEnter: (e: MouseEvent<HTMLElement>) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(-3px) scale(1.03)";
                  el.style.boxShadow = `0 8px 24px rgba(0,0,0,.18)`;
                  el.style.background = b.hoverBg;
                  el.style.color = b.hoverColor;
                },
                onMouseLeave: (e: MouseEvent<HTMLElement>) => {
                  const el = e.currentTarget;
                  el.style.transform = ""; el.style.boxShadow = "";
                  el.style.background = b.bg; el.style.color = b.color;
                },
              };
              if (b.label === "RESUME →") {
                return (
                  <button key={b.label} type="button" {...sharedProps} onClick={() => alert("Request via email")}>
                    {b.icon && <span>{b.icon}</span>}{b.label}
                  </button>
                );
              }
              return (
                <a key={b.label} href={b.href} target="_blank" rel="noopener noreferrer" {...sharedProps}>
                  {b.icon && <span>{b.icon}</span>}{b.label}
                </a>
              );
            })}
          </div>

          {sent ? (
            <div style={{ padding: "24px 0" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: 20, color: "#1a1a2e", margin: "0 0 12px" }}>✉️ Mail client opened — talk soon!</p>
              <button onClick={() => { setSent(false); setName(""); setEmail(""); setMessage(""); }}
                style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: ".1em", background: "none", border: "1.5px solid #1a1a2e", padding: "9px 22px", borderRadius: 999, cursor: "pointer", color: "#1a1a2e" }}>SEND ANOTHER</button>
            </div>
          ) : (
            <form onSubmit={send} style={{ maxWidth: 760 }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 10 }}>
                <select value={topic} onChange={e => setTopic(e.target.value)} style={{ ...inputCls, flex: "0 1 180px", cursor: "pointer" }}>
                  {TOPICS.map(t => <option key={t}>{t}</option>)}
                </select>
                <input type="text"  placeholder="Your name"  value={name}  onChange={e => setName(e.target.value)}  style={inputCls} />
                <input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} style={inputCls} required />
              </div>
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

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: "clamp(28px,4vw,48px)" }}>
            <span style={{ fontFamily: "monospace", fontSize: "clamp(10px,.9vw,13px)", color: "#4A5565", letterSpacing: ".08em" }}>© 2026 MATHIAS BECERRA</span>
            <div style={{ display: "flex", gap: 8 }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" title={s.label}
                  style={{ width: "clamp(32px,2.8vw,42px)", height: "clamp(32px,2.8vw,42px)", borderRadius: "50%", background: "#101828", display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none", transition: "transform .2s, background .2s" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.15)"; (e.currentTarget as HTMLElement).style.background = "#E7000B"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.background = "#101828"; }}>
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="#fff"><path d={s.svg} /></svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
