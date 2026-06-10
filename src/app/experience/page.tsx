"use client";
import { useState, type MouseEvent } from "react";
import BauhausScrollOrnament from "@/components/BauhausScrollOrnament";


const TOPICS  = ["Mentoring", "Collaboration", "Freelance", "Research", "Just saying hi!"];
const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com/mathbecsan",              svg: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" },
  { label: "Dribbble",  href: "https://dribbble.com/mathbecsan",               svg: "M12 24C5.385 24 0 18.615 0 12S5.385 0 12 0s12 5.385 12 12-5.385 12-12 12zm10.12-10.358c-.35-.11-3.17-.953-6.384-.438 1.34 3.684 1.887 6.684 1.992 7.308 2.3-1.555 3.936-4.02 4.395-6.87zm-6.115 7.808c-.153-.9-.75-4.032-2.19-7.77l-.07.02c-5.79 2.015-7.888 6.083-8.06 6.43 1.725 1.34 3.9 2.14 6.27 2.14 1.42 0 2.77-.29 4.05-.82zm-9.565-1.477c.22-.37 2.794-4.647 8.065-6.352.026-.01.05-.01.075-.02-.268-.6-.56-1.2-.867-1.792C8.02 12.89 2.519 12.976 2.069 12.982c0 .156-.006.312-.006.47 0 2.46.942 4.71 2.48 6.403zM2.14 11.503c.457.006 5.19-.026 10.02-2.38-.957-1.7-1.98-3.13-2.14-3.35-2.91 1.376-5.064 3.842-5.74 6.73zM11.01 5.02c.165.22 1.21 1.65 2.15 3.375 2.05-.77 2.93-1.94 3.04-2.085C14.67 4.83 13.4 4.25 12 4.25c-.347 0-.687.03-1.02.07h.03z" },
  { label: "Behance",   href: "https://behance.net/mathbecsan",                svg: "M22 7h-7v-2h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 1.48.715 2.34 1.91 2.34 1.17 0 1.5-.617 1.78-1.31l3.066 1zm-5.64-5.51c-.108-1.29-.815-1.99-1.78-1.99-1.064 0-1.73.687-1.89 1.99h3.67zm-11.08 6.34H4.06V7.5H7c2.63 0 4.56.8 4.56 3.33 0 1.27-.61 2.32-1.77 2.88v.03c1.45.39 2.36 1.49 2.36 3.06 0 2.97-2.18 4.03-4.95 4.03zM6.2 10.65h1.04c1.17 0 1.76-.54 1.76-1.54 0-1.01-.59-1.53-1.76-1.53H6.2v3.07zm0 5.6h1.3c1.19 0 1.98-.62 1.98-1.73 0-1.08-.76-1.73-1.93-1.73H6.2v3.46z" },
  { label: "LinkedIn",  href: "https://linkedin.com/in/mathiasbecerrasanchez", svg: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" },
  { label: "GitHub",    href: "https://github.com/mathbecsan",                 svg: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" },
];

const VIDEO_CARDS = [
  { src: "/experience-screen5/link-1.svg", label: "Polyglot Science",          accent: "#FBBF24", url: "https://youtu.be/ejLeOqRVCW0" },
  { src: "/experience-screen5/link-2.svg", label: "Quechua Transcreation",     accent: "#E31E24", url: "https://www.youtube.com/watch?v=ROownOToAvk" },
  { src: "/experience-screen5/link-3.svg", label: "Full-ride Scholarship",     accent: "#005CAA", url: "https://www.youtube.com/watch?v=WGzLBY6mQx0" },
  { src: "/experience-screen5/link-4.svg", label: "Entrevista Becarios",       accent: "#FBBF24", url: "https://www.youtube.com/watch?v=wlxoo4pVtw4" },
  { src: "/experience-screen5/link-5.svg", label: "Pregrado en el Extranjero", accent: "#E31E24", url: "https://www.youtube.com/watch?v=ywOGJ8Qfo1o" },
  { src: "/experience-screen5/link-6.svg", label: "Abundant Technologies",     accent: "#005CAA", url: "https://www.youtube.com/watch?v=1FEWTn7qaqk" },
];

function Tile({ src, alt, label, isVideo = false, href, style = {} }: {
  src: string; alt: string; label: string; isVideo?: boolean; href?: string; style?: React.CSSProperties;
}) {
  const inner = (
    <>
      {isVideo
        ? <video src={src} autoPlay muted loop playsInline style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        : <img src={src} alt={alt} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
      }
      <div className="tile-overlay">
        <span className="tile-label">{label}</span>
      </div>
    </>
  );
  if (href) {
    return (
      <a href={href} style={{ position: "relative", overflow: "hidden", display: "block", textDecoration: "none", cursor: "pointer", ...style }}>
        {inner}
      </a>
    );
  }
  return <div style={{ position: "relative", overflow: "hidden", ...style }}>{inner}</div>;
}

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

      {/* ── Nav ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          padding: "14px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255,243,222,0.92)",
          backdropFilter: "blur(8px)",
          borderBottom: "1.5px solid rgba(31,41,55,0.08)",
        }}
      >
        <a
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            textDecoration: "none",
          }}
        >
          <img
            src="/experience-screen1/mathbecsanbrandnewlogo.svg"
            alt="MATHBECSAN"
            style={{ height: 26, width: "auto", display: "block" }}
          />
        </a>
        <span
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            color: "#1F2937",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            opacity: 0.4,
          }}
        >
          Experience
        </span>
      </nav>

      {/* ── Top Bauhaus Strip (small) ── */}
      <div
        style={{ width: "100%", overflow: "hidden", lineHeight: 0, paddingTop: 58, maxHeight: 120,
          transition: "filter 0.3s ease, transform 0.3s ease", cursor: "default" }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.filter = "brightness(1.08) saturate(1.15)"; (e.currentTarget as HTMLElement).style.transform = "scaleY(1.04)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.filter = ""; (e.currentTarget as HTMLElement).style.transform = ""; }}
      >
        <img src="/experience-screen1/group-4.svg" alt="" style={{ width: "100%", height: "120px", objectFit: "cover", objectPosition: "top", display: "block" }} />
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
        <a
          href="https://drive.google.com/file/d/1R0fMltGM6YKY0Yp9eQJrPOIduTBiLSNt/view?usp=sharing"
          target="_blank" rel="noopener noreferrer"
          style={{ display: "block", textDecoration: "none", maxWidth: 760, transition: "transform 0.2s ease, filter 0.2s ease" }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px) scale(1.02)"; (e.currentTarget as HTMLElement).style.filter = "drop-shadow(0 8px 24px rgba(230,51,41,0.35))"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.filter = ""; }}
        >
          <img
            src="/experience-screen1/download-resume.svg"
            alt="Download My Resume"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </a>

        {/* Hire Me + Arrow row */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a
            href="mailto:mathbecsan@gmail.com"
            style={{ display: "block", textDecoration: "none", maxWidth: 240, transition: "transform 0.2s ease" }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px) scale(1.04)"; (e.currentTarget as HTMLElement).style.filter = "drop-shadow(0 8px 20px rgba(59,130,246,0.4))"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.filter = ""; }}
          >
            <img
              src="/experience-screen1/hire-me.svg"
              alt="Hire Me!"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </a>
          <img
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
        <img
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
        <img
          src="/experience-interim/work-experience-timeline.svg"
          alt="Work Experience Timeline"
          style={{ width: "78%", height: "auto", display: "block" }}
        />
      </div>

      {/* ── Screen 2: Top Bauhaus Strips ── */}
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0 }}>
        <img
          src="/experience-screen2/group-4.svg"
          alt=""
          style={{ width: "100%", height: "auto", display: "block" }}
        />
      </div>

      {/* ── Screen 2: Timeline ── */}
      <div style={{ width: "100%", background: "#FFF3DE", padding: "clamp(30px, 5vw, 200px) 0", overflowX: "auto" }}>
        <img
          src="/experience-screen2/timeline.svg"
          alt="Work Experience Timeline"
          style={{ width: "135%", minWidth: 1100, height: "auto", display: "block", marginLeft: "3%" }}
        />
      </div>

      {/* ── Screen 3: Dark Gallery ── */}
      <style>{`
        .tile-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0);
          backdrop-filter: blur(0px);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s ease, backdrop-filter 0.3s ease;
        }
        .tile-overlay:hover {
          background: rgba(0,0,0,0.45);
          backdrop-filter: blur(6px);
        }
        .tile-label {
          opacity: 0;
          color: #fff;
          font-family: monospace;
          font-weight: 900;
          font-size: clamp(14px, 2vw, 24px);
          letter-spacing: 0.18em;
          text-transform: uppercase;
          transition: opacity 0.3s ease;
        }
        .tile-overlay:hover .tile-label {
          opacity: 1;
        }
      `}</style>

      <div style={{ width: "100%", background: "#000", padding: "clamp(12px, 2vw, 24px)" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gridTemplateRows: "30vh 30vh 30vh",
          gap: "3px",
        }}>

          <Tile src="/experience-screen3/musicproduction.mp4" alt="Music Production" label="Music Production"  isVideo href="/experience/music-production" style={{ gridColumn: "1", gridRow: "1" }} />
          <Tile src="/experience-screen3/graphicdesign.svg"   alt="Graphic Design"   label="Graphic Design"   href="/experience/graphic-design"   style={{ gridColumn: "2", gridRow: "1 / 3" }} />
          <Tile src="/experience-screen3/design.png"          alt="Design"           label="Design"           href="/experience/design"            style={{ gridColumn: "3", gridRow: "1" }} />
          <Tile src="/experience-screen3/sketches.svg"        alt="Sketches"         label="Sketches"         href="/experience/sketches"          style={{ gridColumn: "1", gridRow: "2" }} />
          <Tile src="/experience-screen3/ethics.svg"          alt="Ethics"           label="Ethics"           href="/experience/ethics"            style={{ gridColumn: "3", gridRow: "2" }} />
          <Tile src="/experience-screen3/logodesigns.png"     alt="Logo Designs"     label="Logo Designs"     href="/experience/logo-designs"      style={{ gridColumn: "1", gridRow: "3" }} />
          <Tile src="/experience-screen3/others.svg"          alt="Others"           label="Others"           href="/experience/others"            style={{ gridColumn: "2", gridRow: "3" }} />
          <Tile src="/experience-screen3/uxui.svg"            alt="UX/UI"            label="UX/UI Implementation" href="/experience/uxui"          style={{ gridColumn: "3", gridRow: "3" }} />

        </div>
      </div>

      {/* ── Screen 4: Projects Gallery ── */}
      <div style={{ width: "100%", background: "#000", padding: "clamp(12px, 2vw, 24px)", paddingTop: 3 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr 1fr",
          gridTemplateRows: "28vh 28vh 28vh",
          gap: "3px",
        }}>

          {/* Row 1, Cols 1–2 — Logo Story */}
          <Tile src="/experience-screen4/logostory.mp4" alt="MATHBECSAN" label="Logo Story" isVideo href="/experience/logo-story"
            style={{ gridColumn: "1 / 3", gridRow: "1" }} />
          <Tile src="/experience-screen4/3d-modelling.svg" alt="3D Modelling" label="3D Modelling" href="/experience/3d-modelling"
            style={{ gridColumn: "3", gridRow: "1" }} />
          <Tile src="/experience-screen4/game-development.svg" alt="Game Development" label="Game Development" href="/experience/game-development"
            style={{ gridColumn: "4", gridRow: "1" }} />
          <Tile src="/experience-screen4/app-development.svg" alt="App Development" label="App Development" href="/experience/app-development"
            style={{ gridColumn: "1", gridRow: "2 / 4" }} />
          <Tile src="/experience-screen4/filmmaking.mov" alt="Filmmaking" label="Filmmaking" isVideo href="/experience/filmmaking"
            style={{ gridColumn: "2", gridRow: "2" }} />
          <Tile src="/experience-screen4/web-development.svg" alt="Web Development" label="Web Development" href="/experience/web-development"
            style={{ gridColumn: "3", gridRow: "2 / 4" }} />
          <Tile src="/experience-screen4/electronics.svg" alt="Electronics" label="Electronics" href="/experience/electronics"
            style={{ gridColumn: "4", gridRow: "2" }} />
          <Tile src="/experience-screen4/research.svg" alt="Research" label="Research" href="/experience/research"
            style={{ gridColumn: "2", gridRow: "3" }} />
          <Tile src="/experience-screen4/miscellaneous.svg" alt="Miscellaneous" label="Miscellaneous" href="/experience/miscellaneous"
            style={{ gridColumn: "4", gridRow: "3" }} />

        </div>
      </div>

      {/* ── Interim 4–5: Media Releases ── */}
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0 }}>
        <img src="/experience-interim45/group.svg" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
      <div style={{ width: "100%", background: "#FFF3DE", padding: "clamp(32px, 5vw, 60px) 0", display: "flex", justifyContent: "flex-start" }}>
        <img src="/experience-interim45/media-releases.svg" alt="Media Releases" style={{ width: "55%", height: "auto", display: "block" }} />
      </div>
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0, transform: "scaleY(-1)" }}>
        <img src="/experience-interim45/group-1.svg" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
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
          <img src="/experience-screen5/header.svg" alt="Video Interviews & Presentations"
            style={{ width: "clamp(320px, 70%, 780px)", height: "auto", display: "block" }} />
        </div>

        {/* 3×2 grid of video cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "clamp(12px, 2vw, 24px)" }}>
          {VIDEO_CARDS.map((card) => (
            <a key={card.url} href={card.url} target="_blank" rel="noopener noreferrer"
              className="video-card"
              style={{ display: "block", textDecoration: "none" }}
            >
              <img src={card.src} alt={card.label} />
              <div className="vc-overlay" />
            </a>
          ))}
        </div>

      </div>

      {/* ── Interim 5–6: Press Features ── */}
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0 }}>
        <img src="/experience-interim56/group.svg" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
      <div style={{ width: "100%", background: "#FFF3DE", padding: "clamp(32px, 5vw, 60px) 0", display: "flex", justifyContent: "flex-end" }}>
        <img src="/experience-interim56/press-features.svg" alt="Press Features" style={{ width: "55%", height: "auto", display: "block" }} />
      </div>
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0, transform: "scaleY(-1)" }}>
        <img src="/experience-interim56/group-1.svg" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
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
            <img src="/experience-screen6/websitefeaturings.svg" alt="Website Featurings" className="press-header" style={{ width: "100%", height: "auto", display: "block", marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <a href="https://abundant-intelligences.net/news/redefining-digital-inclusion-from-peru-to-the-world-virtual-talk-with-mathias-becerra-sanchez/" target="_blank" rel="noopener noreferrer" className="press-card"><img src="/experience-screen6/abundantintelligences.svg" alt="Redefining Digital Inclusion" /></a>
              <a href="https://undergradresearch.stanford.edu/people/mathias-becerra-sanchez" target="_blank" rel="noopener noreferrer" className="press-card"><img src="/experience-screen6/vpuefellowundergraduateresearch.svg" alt="Undergraduate Research Profile" /></a>
              <a href="https://silicon.stanford.edu/2025-silicon-unicode-interns/" target="_blank" rel="noopener noreferrer" className="press-card"><img src="/experience-screen6/siliconunicode.svg" alt="Silicon Unicode Interns 2025" /></a>
              <a href="https://www.ampglobalyouth.org/global-youth-visionaries/" target="_blank" rel="noopener noreferrer" className="press-card"><img src="/experience-screen6/globalyouthvisionares.svg" alt="Global Youth Visionaries" /></a>
            </div>
          </div>

          {/* Right — Social Media Featurings */}
          <div>
            <img src="/experience-screen6/SocialMediaFeaturing.svg" alt="Social Media Featurings" className="press-header" style={{ width: "100%", height: "auto", display: "block", marginBottom: 24 }} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* Instagram header + LinkedIn header */}
              <img src="/experience-screen6/Instagram.svg" alt="Instagram" style={{ width: "100%", height: "auto", display: "block" }} />
              <img src="/experience-screen6/Linkedin.svg" alt="LinkedIn" style={{ width: "100%", height: "auto", display: "block" }} />
              {/* Instagram posts */}
              <a href="https://www.instagram.com/p/DQuISp-EREc/" target="_blank" rel="noopener noreferrer" className="press-card"><img src="/experience-screen6/scienceclubsinternational.svg" alt="Science Clubs International" /></a>
              <a href="https://www.linkedin.com/posts/tsmullaney_new-white-paper-over-6000-of-the-activity-7432847139535241216-dw5x" target="_blank" rel="noopener noreferrer" className="press-card"><img src="/experience-screen6/HAIpaper.svg" alt="HAI Paper Acknowledgment" /></a>
              <a href="https://www.instagram.com/p/DXq0wv6G6nv/" target="_blank" rel="noopener noreferrer" className="press-card"><img src="/experience-screen6/stanfordperuVSO.svg" alt="Stanford Peru VSO" /></a>
              <a href="https://www.linkedin.com/feed/update/urn:li:activity:7439346856062693376/" target="_blank" rel="noopener noreferrer" className="press-card"><img src="/experience-screen6/africacenterfellows.svg" alt="Africa Center Fellows" /></a>
              <a href="https://www.instagram.com/abundantintelligences/" target="_blank" rel="noopener noreferrer" className="press-card"><img src="/experience-screen6/abundanttechnologies.svg" alt="Abundant Technologies" /></a>
              <a href="https://www.linkedin.com/feed/update/urn:li:activity:7439375355313844225/" target="_blank" rel="noopener noreferrer" className="press-card"><img src="/experience-screen6/Mwirelabs.svg" alt="MWIRE Labs" /></a>
            </div>
          </div>

        </div>

        {/* Articles & Publications */}
        <img src="/experience-screen6/articlesandpublications.svg" alt="Articles & Publications" className="press-header" style={{ width: "100%", height: "auto", display: "block", marginBottom: 24 }} />
        <a href="https://drclas.harvard.edu/revista" target="_blank" rel="noopener noreferrer" className="press-card" style={{ maxWidth: 700 }}>
          <img src="/experience-screen6/harvardarticle.svg" alt="Harvard DRCLAS Revista" />
        </a>

      </div>

      {/* ── Interim 6–7: News & Updates ── */}
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0 }}>
        <img src="/experience-interim67/group.svg" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>
      <div style={{ width: "100%", background: "#FFF3DE", padding: "clamp(32px, 5vw, 60px) 0", display: "flex", justifyContent: "flex-start" }}>
        <img src="/experience-interim67/news-updates.svg" alt="News & Updates" style={{ width: "55%", height: "auto", display: "block" }} />
      </div>
      <div style={{ width: "100%", overflow: "hidden", lineHeight: 0, transform: "scaleY(-1)" }}>
        <img src="/experience-interim67/group-1.svg" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
      </div>

      {/* ── Screen 7: News ── */}
      <style>{`
        .news-tag {
          display: inline-block;
          font-family: monospace; font-size: 10px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          padding: 3px 10px; border: 1.5px solid currentColor; border-radius: 2px;
          margin-bottom: 8px;
        }
        .news-entry { opacity: 0.92; transition: opacity 0.2s; }
        .news-entry:hover { opacity: 1; }
      `}</style>

      <div style={{ position: "relative", width: "100%", background: "#F5F1E8", overflow: "hidden", padding: "clamp(48px,6vw,80px) clamp(32px,6vw,80px)" }}>

        {/* Top-right Bauhaus corner */}
        <div style={{ position: "absolute", top: 0, right: 0, width: "clamp(180px,28vw,340px)", pointerEvents: "none" }}>
          <img src="/experience-screen7/bauhaus-corner-1.svg" alt="" style={{ width: "100%", height: "auto", display: "block" }} />
        </div>

        {/* Bottom-right dots */}
        <div style={{ position: "absolute", bottom: 32, right: 40, display: "flex", gap: 8, pointerEvents: "none" }}>
          {["#E63329","#1F2937","#1F2937"].map((c,i) => (
            <div key={i} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
          ))}
        </div>

        {/* Spiral graphic */}
        <div style={{ position: "absolute", top: "18%", right: "4%", width: "clamp(200px,32vw,420px)", opacity: 0.18, pointerEvents: "none" }}>
          <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {Array.from({length: 22}, (_,i) => (
              <ellipse key={i} cx="200" cy="220" rx={20+i*17} ry={15+i*15} stroke="#1F2937" strokeWidth="0.8" />
            ))}
          </svg>
        </div>

        {/* Divider line */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "clamp(24px,3vw,40px)", marginTop: "clamp(8px,2vw,24px)" }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1F2937", flexShrink: 0 }} />
          <div style={{ flex: 1, maxWidth: 500, height: 1, background: "#1F2937", opacity: 0.25 }} />
        </div>

        {/* Timeline content */}
        <div style={{ maxWidth: 560, position: "relative", zIndex: 1 }}>

          {/* Year header */}
          <p style={{ fontFamily: "monospace", fontWeight: 700, fontSize: 13, color: "#E63329", letterSpacing: "0.1em", margin: "0 0 20px" }}>2026</p>

          {/* Vertical line */}
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: 100, top: 0, bottom: 0, width: 1, background: "rgba(31,41,55,0.12)" }} />

            {NEWS_ITEMS.map((item, i) => (
              <div key={i} className="news-entry" style={{ display: "flex", gap: 0, marginBottom: "clamp(20px,3vw,32px)", alignItems: "flex-start" }}>
                {/* Date */}
                <div style={{ width: 90, flexShrink: 0, paddingTop: 2 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 11, fontWeight: 700, color: "#E63329", letterSpacing: "0.06em" }}>{item.date}</span>
                </div>
                {/* Dot */}
                <div style={{ width: 20, flexShrink: 0, display: "flex", justifyContent: "center", paddingTop: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: item.dotColor, flexShrink: 0 }} />
                </div>
                {/* Content */}
                <div style={{ flex: 1, paddingLeft: 16 }}>
                  <span className="news-tag" style={{ color: item.tagColor, borderColor: item.tagColor }}>{item.tag}</span>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(13px,1.1vw,15px)", color: "rgba(31,41,55,0.8)", margin: 0, lineHeight: 1.65 }}
                    dangerouslySetInnerHTML={{ __html: item.text }} />
                </div>
              </div>
            ))}

          </div>
        </div>
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
        <img src="/second-screen/word-2.svg" aria-hidden alt="" style={{ position: "absolute", bottom: 0, left: 0, width: "clamp(80px,14vw,220px)", zIndex: 0 }} />

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

// ── NEWS DATA — update this array to add/edit news items ──────────────────
const NEWS_ITEMS = [
  {
    date: "JUN 2026",
    tag: "Award",
    tagColor: "#E63329",
    dotColor: "#E63329",
    text: `<strong>CS377U — Best Generative Research Award & Best Project in Class (Triple Tie)</strong> · Speak.io<br/>
Led UX research and front-end development for Speak.io, an AI-powered conversational language learning app built in React Native, TypeScript & Expo. Recognized for strongest generative research process and as one of the top projects by a panel of industry judges.`,
  },
  {
    date: "MAY 2026",
    tag: "Program",
    tagColor: "#FBBF24",
    dotColor: "#FBBF24",
    text: `Led a Stanford Peru admissions webinar for prospective international undergrad and grad students — <strong>500+ registrations</strong>, 99% post-event satisfaction rating.<br/><br/>
Accepted to three CodePath courses: <strong>WEB102, AI Dev 101, and Cybersecurity</strong>.<br/><br/>
Selected for the <strong>Hack the Hood AI Summer Program</strong> & <strong>Breakthrough Tech</strong>.`,
  },
  {
    date: "APR 2026",
    tag: "Role",
    tagColor: "#3B82F6",
    dotColor: "#3B82F6",
    text: `Joined Stanford University Department of Psychology as <strong>Quality Assurance Specialist</strong>.<br/><br/>
Completed <strong>CodePath WEB101</strong>.`,
  },
  {
    date: "MAR 2026",
    tag: "Accepted",
    tagColor: "#3B82F6",
    dotColor: "#3B82F6",
    text: `Deferred acceptance to <strong>ITS 2026 Global Policy Fellowship</strong>.<br/><br/>
Accepted to and completed the <strong>ASPIRE AI Integrated Leadership Program</strong>.`,
  },
  {
    date: "FEB 2026",
    tag: "Fellowship",
    tagColor: "#1F2937",
    dotColor: "#1F2937",
    text: `Accepted to the <strong>MWire Labs Fellowship</strong> and <strong>TechForward Fellowship</strong>.<br/>
Building an MVP for minoritized and low-resource language communities in rural India and Africa.`,
  },
];
