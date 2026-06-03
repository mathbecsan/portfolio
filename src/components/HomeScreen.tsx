"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import ThirdScreen from "./ThirdScreen";
import FourthScreen from "./FourthScreen";
import FifthScreen from "./FifthScreen";
import SixthScreen from "./SixthScreen";
import SeventhScreen from "./SeventhScreen";

const NAV = ["Home", "About", "Process", "Impact"];

const GREETINGS = [
  { text: "Allinllachu.", lang: "Quechua",    script: "Latin"       },
  { text: "Hello.",       lang: "English",    script: "Latin"       },
  { text: "Bonjour.",     lang: "French",     script: "Latin"       },
  { text: "こんにちは。",  lang: "Japanese",   script: "Kanji"       },
  { text: "مرحباً.",      lang: "Arabic",     script: "Arabic"      },
  { text: "안녕하세요.",   lang: "Korean",     script: "Hangul"      },
  { text: "नमस्ते.",      lang: "Hindi",      script: "Devanagari"  },
  { text: "Привет.",      lang: "Russian",    script: "Cyrillic"    },
  { text: "שָׁלוֹם.",     lang: "Hebrew",     script: "Hebrew"      },
  { text: "Hola.",        lang: "Spanish",    script: "Latin"       },
  { text: "สวัสดี.",       lang: "Thai",       script: "Thai"        },
  { text: "Merhaba.",     lang: "Turkish",    script: "Latin"       },
  { text: "Olá.",         lang: "Portuguese", script: "Latin"       },
];

const ROLES = [
  { src: "/first-screen/role-uxui.svg",      label: "UX/UI Engineer"      },
  { src: "/first-screen/role-data.svg",      label: "Data Scientist"      },
  { src: "/first-screen/role-product.svg",   label: "Product Designer"    },
  { src: "/first-screen/role-fullstack.svg", label: "Fullstack Developer" },
];

const WORDS = ["design", "build", "program"];

// ── Three.js background ───────────────────────────────────────
function useThreeBackground(mountRef: RefObject<HTMLDivElement | null>) {
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
      { geo: new THREE.IcosahedronGeometry(1.6, 1), color: 0xe63329, x: 3.5, y: 2,    z: -2, rx: 0.003, ry: 0.005 },
      { geo: new THREE.TorusGeometry(1.1, 0.3, 8, 24), color: 0xf5a623, x: 4, y: -2.5, z: -3, rx: 0.005, ry: 0.002 },
      { geo: new THREE.OctahedronGeometry(1.3),     color: 0x2952a3, x: 2, y: -0.5,  z: -4, rx: 0.002, ry: 0.004 },
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

// ── Scroll-reveal ─────────────────────────────────────────────
function useReveal(ref: RefObject<HTMLElement | null>, threshold = 0.1) {
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

// ── HomeScreen ────────────────────────────────────────────────
export default function HomeScreen({ visible }: { visible: boolean }) {
  const mountRef   = useRef<HTMLDivElement | null>(null);
  const posterRef  = useRef<HTMLElement | null>(null);
  const [idx,      setIdx]      = useState(0);
  const [animKey,  setAnimKey]  = useState(0);
  const [roleIdx,  setRoleIdx]  = useState(0);
  const [wordIdx,  setWordIdx]  = useState(0);
  const [greetExit, setGreetExit] = useState(false);
  const [roleExit,  setRoleExit]  = useState(false);
  const [wordExit,  setWordExit]  = useState(false);
  const [fadeIn,   setFadeIn]   = useState(false);
  const posterVisible = useReveal(posterRef as RefObject<HTMLElement>);

  useThreeBackground(mountRef);

  useEffect(() => { if (visible) setTimeout(() => setFadeIn(true), 100); }, [visible]);

  // Greeting cycles every 2.2s
  useEffect(() => {
    const t = setInterval(() => {
      setGreetExit(true);
      setTimeout(() => { setIdx(p => (p + 1) % GREETINGS.length); setAnimKey(p => p + 1); setGreetExit(false); }, 300);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  // Role + word cycle every 3s
  useEffect(() => {
    const t = setInterval(() => {
      setRoleExit(true); setWordExit(true);
      setTimeout(() => {
        setRoleIdx(p => (p + 1) % ROLES.length);
        setWordIdx(p => (p + 1) % WORDS.length);
        setRoleExit(false); setWordExit(false);
      }, 300);
    }, 3000);
    return () => clearInterval(t);
  }, []);

  const isRTL = ["Arabic", "Hebrew"].includes(GREETINGS[idx].lang);

  return (
    <div style={{ opacity: fadeIn ? 1 : 0, transition: "opacity 0.8s ease" }}>
      <style>{`
        @keyframes greetIn  { from { transform:translateY(110%); opacity:0 } to { transform:translateY(0); opacity:1 } }
        @keyframes fadeUp   { from { transform:translateY(32px); opacity:0 } to { transform:translateY(0); opacity:1 } }
        @keyframes fadeLeft { from { transform:translateX(-40px); opacity:0 } to { transform:translateX(0); opacity:1 } }
        @keyframes fadeRight{ from { transform:translateX(40px); opacity:0 } to { transform:translateX(0); opacity:1 } }
        @keyframes wordIn   { from { transform:translateY(14px); opacity:0 } to { transform:translateY(0); opacity:1 } }
      `}</style>

      {/* ══════════════════════════════════════════════
          SECTION 1 — Dark hero (full viewport)
      ══════════════════════════════════════════════ */}
      <section className="relative flex flex-col overflow-hidden bg-[#0d0d0d]"
        style={{ height: "100svh", minHeight: 600, padding: "3vh 6vw 2vh" }}>

        <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" style={{ left: "45%" }} />
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "100px 100%" }} />

        {/* Nav — plain links, no background image */}
        <nav className="relative z-10 flex justify-between items-center mb-auto pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center font-mono font-bold text-white text-sm"
              style={{ width: 36, height: 36, background: "#2952A3", borderRadius: 4, letterSpacing: "0.05em" }}>MB</div>
            <span className="text-xs uppercase tracking-[0.1em] text-[#f0ede6]/80">Portfolio</span>
          </div>
          <div className="flex gap-6 font-mono text-xs text-[#f0ede6]/40 tracking-[0.2em] uppercase">
            {NAV.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#f0ede6] transition-colors">{l}</a>
            ))}
          </div>
        </nav>

        {/* Greeting + name */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="overflow-hidden" style={{ lineHeight: 1.05, direction: isRTL ? "rtl" : "ltr" }}>
            <span key={animKey} className="block font-mono text-[#f0ede6]"
              style={{
                fontSize: "clamp(44px, 8vw, 120px)",
                opacity: greetExit ? 0 : 1,
                transform: greetExit ? "translateY(-28px)" : undefined,
                transition: greetExit ? "opacity 0.28s ease, transform 0.28s ease" : "none",
                animation: !greetExit ? "greetIn 0.42s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
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

        {/* Scroll hint */}
        <div className="relative z-10 flex items-center gap-3 pb-2">
          <div style={{ width: 1, height: 36, background: "rgba(240,237,230,0.25)" }} />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#f0ede6]/25">scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 — Cream poster (profile + statement)
          One continuous composition, no internal gaps
      ══════════════════════════════════════════════ */}
      <section id="about" ref={posterRef} className="relative overflow-hidden"
        style={{ background: "#F5E6C0", margin: 0, padding: 0 }}>

        {/* ── Bauhaus banner ── */}
        <div style={{ width: "100%", height: "clamp(90px, 13vw, 170px)", overflow: "hidden" }}>
          <img src="/bauhaus-pattern.svg" alt="" aria-hidden="true"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
        </div>

        {/* ── Portrait + role (grid) ── */}
        <div style={{ position: "relative", height: "clamp(340px, 44vw, 600px)" }}>

          {/* Photo fills right 52% */}
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: "52%", overflow: "hidden",
            animation: posterVisible ? "fadeRight 0.7s ease 0.2s both" : "none",
          }}>
            <img src="/profile-picture.png" alt="Mathias Becerra"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", display: "block" }} />
          </div>

          {/* Text left 52% */}
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: "52%",
            padding: "clamp(20px, 3.5vw, 52px) clamp(20px, 5vw, 64px)",
            display: "flex", flexDirection: "column", justifyContent: "center",
            gap: "clamp(6px, 1vw, 14px)",
            animation: posterVisible ? "fadeLeft 0.7s ease 0.15s both" : "none",
          }}>
            <img src="/first-screen/ima.svg" alt="I'm a"
              style={{ width: "clamp(100px, 13vw, 190px)", height: "auto", display: "block" }} />

            {/* Role SVGs — crossfade on cycle */}
            <div style={{ position: "relative", width: "clamp(240px, 42vw, 520px)", aspectRatio: "855/427" }}>
              {ROLES.map((role, i) => (
                <img key={role.src} src={role.src} alt={role.label}
                  style={{
                    position: i === 0 ? "relative" : "absolute", top: 0, left: 0,
                    width: "100%", height: "auto", display: "block",
                    opacity: roleIdx === i ? (roleExit ? 0 : 1) : 0,
                    transform: roleIdx === i ? (roleExit ? "translateY(-8px)" : "translateY(0)") : "translateY(8px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    pointerEvents: roleIdx === i ? "auto" : "none",
                  }} />
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src="/first-screen/from-peru.svg" alt="From Lambayeque, Peru."
                style={{ width: "clamp(110px, 16vw, 220px)", height: "auto", display: "block" }} />
              <img src="/first-screen/peruflag.svg" alt="Peru flag"
                style={{ width: "clamp(20px, 2.5vw, 34px)", height: "auto", display: "block" }} />
            </div>
          </div>
        </div>

        {/* ── Bridge: mid Bauhaus bar (right-aligned, 65% width) ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", overflow: "hidden",
          animation: posterVisible ? "fadeUp 0.6s ease 0.3s both" : "none" }}>
          <img src="/second-screen/word-4.svg" alt="" aria-hidden="true"
            style={{ width: "65%", height: "clamp(70px, 10vw, 130px)", objectFit: "cover", objectPosition: "left center", display: "block" }} />
        </div>

        {/* ── Mission statement ── */}
        <div style={{ position: "relative", padding: "clamp(40px, 6vw, 80px) clamp(40px, 7vw, 120px) clamp(60px, 8vw, 100px)" }}>

          {/* Right accent bar */}
          <img src="/second-screen/word-4.svg" alt="" aria-hidden="true"
            style={{
              position: "absolute", top: 0, right: 0, bottom: 0,
              width: "clamp(24px, 2.5vw, 40px)", height: "100%",
              objectFit: "cover", objectPosition: "right center", display: "block",
            }} />

          <p style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 4.5vw, 68px)",
            lineHeight: 1.15,
            color: "#1a1a1a",
            margin: 0,
            maxWidth: "16ch",
            opacity: posterVisible ? 1 : 0,
            transform: posterVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
          }}>
            {"I "}
            <span key={wordIdx} style={{
              display: "inline-block", color: "#6B1A1A", fontStyle: "italic",
              opacity: wordExit ? 0 : 1,
              transform: wordExit ? "translateY(-10px)" : "translateY(0)",
              transition: "opacity 0.26s ease, transform 0.26s ease",
              animation: !wordExit ? "wordIn 0.36s cubic-bezier(0.22,1,0.36,1) both" : "none",
            }}>
              {WORDS[wordIdx]}
            </span>
            {" products with meticulous attention to detail to create accessible user experiences for social good"}
          </p>
        </div>

        {/* ── Bottom corner clusters ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <img src="/second-screen/word-2.svg" alt="" aria-hidden="true"
            style={{ width: "clamp(110px, 18vw, 280px)", height: "auto", display: "block" }} />
          <img src="/second-screen/word-3.svg" alt="" aria-hidden="true"
            style={{ width: "clamp(110px, 18vw, 280px)", height: "auto", display: "block" }} />
        </div>
      </section>

      <ThirdScreen />
      <FourthScreen />
      <FifthScreen />
      <SixthScreen />
      <SeventhScreen />
    </div>
  );
}
