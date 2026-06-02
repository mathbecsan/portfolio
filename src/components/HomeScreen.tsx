"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const GREETINGS = [
  { text: "Allinllachu.", lang: "Quechua",   script: "Latin"    },
  { text: "Hello.",       lang: "English",   script: "Latin"    },
  { text: "Bonjour.",     lang: "French",    script: "Latin"    },
  { text: "Hola.",        lang: "Spanish",   script: "Latin"    },
  { text: "こんにちは。",    lang: "Japanese",  script: "Kanji"    },
  { text: "مرحباً.",      lang: "Arabic",    script: "Arabic"   },
  { text: "안녕하세요.",     lang: "Korean",    script: "Hangul"   },
  { text: "नमस्ते.",      lang: "Hindi",     script: "Devanagari"},
  { text: "Привет.",      lang: "Russian",   script: "Cyrillic" },
  { text: "שָׁלוֹם.",     lang: "Hebrew",    script: "Hebrew"   },
  { text: "Merhaba.",     lang: "Turkish",   script: "Latin"    },
  { text: "Olá.",         lang: "Portuguese",script: "Latin"    },
  { text: "สวัสดี.",       lang: "Thai",      script: "Thai"     },
  { text: "Habari.",      lang: "Swahili",   script: "Latin"    },
  { text: "Hei.",         lang: "Norwegian", script: "Latin"    },
];

// ── Three.js background ────────────────────────────────────────
function useThreeBackground(mountRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 9;

    const shapes: THREE.Mesh[] = [];
    [
      { geo: new THREE.IcosahedronGeometry(1.6, 1), color: 0xE63329, x: 3.5,  y: 2,    z: -2,  rx: 0.003, ry: 0.005 },
      { geo: new THREE.TorusGeometry(1.1, 0.3, 8, 24), color: 0xF5A623, x: 4,   y: -2.5, z: -3,  rx: 0.005, ry: 0.002 },
      { geo: new THREE.OctahedronGeometry(1.3),     color: 0x2952A3, x: 2,    y: -0.5, z: -4,  rx: 0.002, ry: 0.004 },
    ].forEach(d => {
      const mat  = new THREE.MeshBasicMaterial({ color: d.color, wireframe: true, opacity: 0.13, transparent: true });
      const mesh = new THREE.Mesh(d.geo, mat);
      mesh.position.set(d.x, d.y, d.z);
      mesh.userData = { rx: d.rx, ry: d.ry };
      scene.add(mesh); shapes.push(mesh);
    });

    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      shapes.forEach(m => { m.rotation.x += m.userData.rx; m.rotation.y += m.userData.ry; });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); renderer.dispose(); if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement); };
  }, [mountRef]);
}

// ── MB Logo mark ───────────────────────────────────────────────
function MBLogo() {
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex items-center justify-center font-mono font-bold text-white text-sm"
        style={{ width: 36, height: 36, background: "#2952A3", borderRadius: 4, letterSpacing: "0.05em" }}
      >
        MB
      </div>
      <span className="font-mono font-bold text-[#f0ede6] text-sm tracking-widest uppercase">
        Mathias Becerra
      </span>
    </div>
  );
}

// ── Main HomeScreen ─────────────────────────────────────────────
export default function HomeScreen({ visible }: { visible: boolean }) {
  const mountRef   = useRef<HTMLDivElement>(null);
  const [idx,       setIdx]      = useState(0);
  const [animKey,   setAnimKey]  = useState(0);
  const [exiting,   setExiting]  = useState(false);
  const [contentIn, setContentIn] = useState(false);

  useThreeBackground(mountRef);

  useEffect(() => { if (visible) setTimeout(() => setContentIn(true), 100); }, [visible]);

  // Faster cycling — 1500ms hold
  useEffect(() => {
    const interval = setInterval(() => {
      setExiting(true);
      setTimeout(() => {
        setIdx(prev => (prev + 1) % GREETINGS.length);
        setAnimKey(prev => prev + 1);
        setExiting(false);
      }, 320);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const isRTL = ["Arabic", "Hebrew"].includes(GREETINGS[idx].lang);

  return (
    <div
      className="bg-[#0d0d0d] overflow-x-hidden"
      style={{ opacity: contentIn ? 1 : 0, transition: "opacity 0.8s ease" }}
    >
      <style>{`
        @keyframes greetingIn {
          from { transform: translateY(110%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* ── SECTION 1: Hero (full viewport) ─────────────────── */}
      <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ padding: "3vh 6vw" }}>

        {/* Three.js — right side only */}
        <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" style={{ left: "45%" }} />

        {/* Vertical grid lines */}
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "100px 100%" }} />

        {/* Nav */}
        <nav className="relative z-10 flex justify-between items-center w-full mb-auto pb-4">
          <MBLogo />
          <div className="flex gap-8 font-mono text-xs text-[#f0ede6]/40 tracking-[0.2em] uppercase">
            {["Home","About","Process","Impact"].map((l, i) => (
              <a key={l} href={`#${l.toLowerCase()}`}
                className="hover:text-[#f0ede6] transition-colors"
                style={i === 0 ? { color: "#f0ede6", borderBottom: "1px solid #E63329", paddingBottom: 2 } : {}}>
                {l}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero text */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">

          {/* Greeting */}
          <div className="overflow-hidden" style={{ lineHeight: 1.05, direction: isRTL ? "rtl" : "ltr" }}>
            <span
              key={animKey}
              className="block font-mono text-[#f0ede6]"
              style={{
                fontSize: "clamp(44px, 8vw, 120px)",
                opacity: exiting ? 0 : 1,
                transform: exiting ? "translateY(-28px)" : undefined,
                transition: exiting ? "opacity 0.28s ease, transform 0.28s ease" : "none",
                animation: !exiting ? "greetingIn 0.42s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
              }}
            >
              {GREETINGS[idx].text}
            </span>
          </div>

          <p className="font-mono text-[#f0ede6] leading-none mt-1" style={{ fontSize: "clamp(32px, 5.5vw, 88px)" }}>
            i&apos;m
          </p>
          <h1 className="font-mono font-bold text-[#f0ede6] leading-none tracking-tight" style={{ fontSize: "clamp(44px, 7.5vw, 118px)" }}>
            mathias.
          </h1>

          {/* Language label */}
          <p className="mt-3 font-mono text-[10px] tracking-[0.35em] uppercase text-[#f0ede6]/25">
            {GREETINGS[idx].lang} · {GREETINGS[idx].script}
          </p>
        </div>

        {/* Scroll hint */}
        <div className="relative z-10 flex items-center gap-3 pb-2" style={{ opacity: 0.3 }}>
          <div style={{ width: 1, height: 40, background: "#f0ede6" }} />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#f0ede6]">scroll</span>
        </div>
      </section>

      {/* ── SECTION 2: About / Bio (scrolls into view) ──────── */}
      <section id="about" className="relative min-h-[60vh] flex flex-col justify-center" style={{ padding: "8vh 6vw" }}>

        {/* ── Profile card ───────────────────────────────── */}
        <div style={{
          borderRadius: 16,
          overflow: "hidden",
          maxWidth: 860,
          boxShadow: "0 0 0 1px rgba(255,255,255,0.07)",
        }}>

          {/* Top: Bauhaus pattern banner + MB logo */}
          <div style={{
            position: "relative",
            height: "clamp(120px, 16vw, 200px)",
            backgroundImage: "url('/bauhaus-pattern.png')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}>
            <img
              src="/mb-logo.png"
              alt="MB"
              style={{
                position: "absolute",
                top: 16,
                left: 16,
                width: "clamp(44px, 5vw, 64px)",
                height: "clamp(44px, 5vw, 64px)",
                borderRadius: 8,
              }}
            />
          </div>

          {/* Bottom: dark + orange bg, text left, photo right */}
          <div style={{
            display: "flex",
            background: "#111",
            minHeight: "clamp(180px, 22vw, 280px)",
          }}>
            {/* Text left */}
            <div style={{
              flex: 1,
              padding: "clamp(20px, 3vw, 40px)",
              background: "#E07340",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 8,
            }}>
              <p className="font-mono text-white" style={{ fontSize: "clamp(14px, 1.6vw, 22px)", opacity: 0.9 }}>
                I&apos;m
              </p>
              <h2 className="font-mono font-bold text-white leading-tight" style={{ fontSize: "clamp(18px, 2.2vw, 30px)" }}>
                Full-Stack Developer
              </h2>
              <p className="font-mono text-white/80 leading-relaxed" style={{ fontSize: "clamp(12px, 1.1vw, 16px)", maxWidth: 340 }}>
                who builds accessible user interfaces to create experiences
                at the intersection of HCI, design, and AI.
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 mt-2">
                {[
                  { label: "About",          href: "#about"  },
                  { label: "Projects",       href: "#work"   },
                  { label: "Impact",         href: "#impact" },
                  { label: "Resume",         href: "/resume" },
                  { label: "Contact",        href: "mailto:mathias@stanford.edu" },
                ].map(btn => (
                  <a
                    key={btn.label}
                    href={btn.href}
                    className="font-mono border border-white/40 text-white/90 rounded-full hover:bg-white hover:text-[#E07340] transition-all duration-200"
                    style={{ padding: "6px 16px", fontSize: "clamp(10px, 0.9vw, 13px)", letterSpacing: "0.04em" }}
                  >
                    {btn.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Photo right */}
            <div style={{
              width: "clamp(160px, 22vw, 280px)",
              flexShrink: 0,
              overflow: "hidden",
              background: "#0d0d0d",
            }}>
              <img
                src="/mathias-photo.jpg"
                alt="Mathias Becerra"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center top",
                }}
              />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
