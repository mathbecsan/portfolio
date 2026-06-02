"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const GREETINGS = [
  { text: "Allinllachu.", lang: "Quechua",    script: "Latin"      },
  { text: "Hello.",       lang: "English",    script: "Latin"      },
  { text: "Bonjour.",     lang: "French",     script: "Latin"      },
  { text: "こんにちは。",   lang: "Japanese",   script: "Kanji"      },
  { text: "مرحباً.",     lang: "Arabic",     script: "Arabic"     },
  { text: "안녕하세요.",    lang: "Korean",     script: "Hangul"     },
  { text: "नमस्ते.",     lang: "Hindi",      script: "Devanagari" },
  { text: "Привет.",      lang: "Russian",    script: "Cyrillic"   },
  { text: "שָׁלוֹם.",    lang: "Hebrew",     script: "Hebrew"     },
  { text: "Hola.",        lang: "Spanish",    script: "Latin"      },
  { text: "สวัสดี.",      lang: "Thai",       script: "Thai"       },
  { text: "Merhaba.",     lang: "Turkish",    script: "Latin"      },
  { text: "Olá.",         lang: "Portuguese", script: "Latin"      },
];

// ── Three.js ───────────────────────────────────────────────────
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
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 9;
    const meshes: THREE.Mesh[] = [];
    [
      { geo: new THREE.IcosahedronGeometry(1.6, 1), color: 0xE63329, x: 3.5,  y: 2,    z: -2,  rx: 0.003, ry: 0.005 },
      { geo: new THREE.TorusGeometry(1.1, 0.3, 8, 24), color: 0xF5A623, x: 4,  y: -2.5, z: -3,  rx: 0.005, ry: 0.002 },
      { geo: new THREE.OctahedronGeometry(1.3),     color: 0x2952A3, x: 2,    y: -0.5, z: -4,  rx: 0.002, ry: 0.004 },
    ].forEach(d => {
      const mat = new THREE.MeshBasicMaterial({ color: d.color, wireframe: true, opacity: 0.13, transparent: true });
      const m = new THREE.Mesh(d.geo, mat);
      m.position.set(d.x, d.y, d.z);
      m.userData = { rx: d.rx, ry: d.ry };
      scene.add(m); meshes.push(m);
    });
    let raf: number;
    const tick = () => { raf = requestAnimationFrame(tick); meshes.forEach(m => { m.rotation.x += m.userData.rx; m.rotation.y += m.userData.ry; }); renderer.render(scene, camera); };
    tick();
    const onResize = () => { const w = mount.clientWidth, h = mount.clientHeight; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", onResize); renderer.dispose(); if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement); };
  }, [mountRef]);
}

// ── Scroll-reveal hook ─────────────────────────────────────────
function useReveal(ref: React.RefObject<HTMLElement | null>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

// ── MB nav logo ────────────────────────────────────────────────
function MBLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center font-mono font-bold text-white text-sm"
        style={{ width: 36, height: 36, background: "#2952A3", borderRadius: 4, letterSpacing: "0.05em" }}>
        MB
      </div>
      <span className="font-mono font-bold text-[#f0ede6] text-sm tracking-widest uppercase">Mathias Becerra</span>
    </div>
  );
}

// ── HomeScreen ─────────────────────────────────────────────────
export default function HomeScreen({ visible }: { visible: boolean }) {
  const mountRef   = useRef<HTMLDivElement>(null);
  const cardRef    = useRef<HTMLDivElement>(null);
  const [idx,      setIdx]      = useState(0);
  const [animKey,  setAnimKey]  = useState(0);
  const [exiting,  setExiting]  = useState(false);
  const [fadeIn,   setFadeIn]   = useState(false);
  const cardVisible = useReveal(cardRef as React.RefObject<HTMLElement>);

  useThreeBackground(mountRef);

  useEffect(() => { if (visible) setTimeout(() => setFadeIn(true), 100); }, [visible]);

  useEffect(() => {
    const t = setInterval(() => {
      setExiting(true);
      setTimeout(() => { setIdx(p => (p + 1) % GREETINGS.length); setAnimKey(p => p + 1); setExiting(false); }, 320);
    }, 1500);
    return () => clearInterval(t);
  }, []);

  const isRTL = ["Arabic", "Hebrew"].includes(GREETINGS[idx].lang);

  return (
    <div className="bg-[#0d0d0d]" style={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.8s ease" }}>
      <style>{`
        @keyframes greetingIn { from { transform:translateY(110%);opacity:0 } to { transform:translateY(0);opacity:1 } }
        @keyframes fadeUp     { from { transform:translateY(40px);opacity:0 } to { transform:translateY(0);opacity:1 } }
        @keyframes fadeLeft   { from { transform:translateX(-60px);opacity:0 } to { transform:translateX(0);opacity:1 } }
        @keyframes fadeRight  { from { transform:translateX(60px);opacity:0 } to { transform:translateX(0);opacity:1 } }
      `}</style>

      {/* ═══════════════════════════════════════════════════
          SECTION 1 — Hero (full viewport)
      ═══════════════════════════════════════════════════ */}
      <section className="relative flex flex-col overflow-hidden" style={{ minHeight: "100vh", height: "100svh", padding: "3vh 6vw 2vh" }}>

        {/* Three.js — right half only */}
        <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" style={{ left: "45%" }} />

        {/* Vertical lines */}
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "100px 100%" }} />

        {/* Nav */}
        <nav className="relative z-10 flex justify-between items-center mb-auto pb-4">
          <MBLogo />
          <div className="flex gap-8 font-mono text-xs text-[#f0ede6]/40 tracking-[0.2em] uppercase">
            {["Home","About","Process","Impact"].map((l, i) => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#f0ede6] transition-colors"
                style={i === 0 ? { color: "#f0ede6", borderBottom: "1px solid #E63329", paddingBottom: 2 } : {}}>
                {l}
              </a>
            ))}
          </div>
        </nav>

        {/* Hero text */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="overflow-hidden" style={{ lineHeight: 1.05, direction: isRTL ? "rtl" : "ltr" }}>
            <span key={animKey} className="block font-mono text-[#f0ede6]"
              style={{
                fontSize: "clamp(44px, 8vw, 120px)",
                opacity: exiting ? 0 : 1,
                transform: exiting ? "translateY(-28px)" : undefined,
                transition: exiting ? "opacity 0.28s ease,transform 0.28s ease" : "none",
                animation: !exiting ? "greetingIn 0.42s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
              }}>
              {GREETINGS[idx].text}
            </span>
          </div>
          <p className="font-mono text-[#f0ede6] leading-none mt-1" style={{ fontSize: "clamp(32px, 5.5vw, 88px)" }}>i&apos;m</p>
          <h1 className="font-mono font-bold text-[#f0ede6] leading-none tracking-tight" style={{ fontSize: "clamp(44px, 7.5vw, 118px)" }}>mathias.</h1>
          <p className="mt-3 font-mono text-[10px] tracking-[0.35em] uppercase text-[#f0ede6]/25">
            {GREETINGS[idx].lang} · {GREETINGS[idx].script}
          </p>
        </div>

        {/* Scroll indicator */}
        <div className="relative z-10 flex items-center gap-3" style={{ paddingBottom: "1vh" }}>
          <div style={{ width: 1, height: 40, background: "rgba(240,237,230,0.3)" }} />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#f0ede6]/30">scroll</span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          SECTION 2 — Profile (full-bleed, no card)
      ═══════════════════════════════════════════════════ */}
      <section id="about" ref={cardRef} className="relative overflow-hidden" style={{ background: "#F5E6C0" }}>

        {/* Bauhaus banner — full width */}
        <div style={{
          width: "100%",
          height: "clamp(100px, 14vw, 180px)",
          backgroundImage: "url('/bauhaus-pattern.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          animation: cardVisible ? "fadeUp 0.7s ease 0s both" : "none",
        }} />

        {/* Text + photo row */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          minHeight: "clamp(260px, 30vw, 420px)",
        }}>
          {/* Left — text */}
          <div style={{
            flex: "1 1 280px",
            padding: "clamp(24px, 5vw, 60px) clamp(20px, 6vw, 72px)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "clamp(6px, 1vw, 14px)",
            animation: cardVisible ? "fadeLeft 0.7s ease 0.15s both" : "none",
          }}>
            <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(16px, 2.2vw, 28px)", color: "#6B1A1A", margin: 0 }}>
              I&apos;m a
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{
                display: "inline-block", alignSelf: "flex-start",
                background: "#111", color: "#fff",
                fontFamily: "monospace", fontWeight: 900,
                fontSize: "clamp(24px, 4vw, 56px)",
                letterSpacing: "0.04em",
                padding: "2px 14px 6px",
              }}>UX/UI</span>
              <span style={{
                display: "inline-block", alignSelf: "flex-start",
                background: "#CC1F1A", color: "#fff",
                fontFamily: "monospace", fontWeight: 900,
                fontSize: "clamp(24px, 4vw, 56px)",
                letterSpacing: "0.04em",
                padding: "2px 14px 6px",
              }}>ENGINEER</span>
            </div>
            <p style={{ fontFamily: "monospace", fontSize: "clamp(11px, 1.2vw, 16px)", color: "#6B1A1A", marginTop: 8, letterSpacing: "0.03em" }}>
              From Lambayeque, Peru. 🇵🇪
            </p>
          </div>

          {/* Right — photo */}
          <div style={{
            flex: "0 0 clamp(200px, 38vw, 500px)",
            overflow: "hidden",
            animation: cardVisible ? "fadeRight 0.7s ease 0.2s both" : "none",
          }}>
            <img src="/profile-picture.png" alt="Mathias Becerra"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
          </div>
        </div>
      </section>

    </div>
  );
}
