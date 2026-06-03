"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import ThirdScreen from "./ThirdScreen";
import FourthScreen from "./FourthScreen";
import FifthScreen from "./FifthScreen";
import SixthScreen from "./SixthScreen";
import SeventhScreen from "./SeventhScreen";
import EighthScreen from "./EighthScreen";

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

// ── Three.js background — particle network + mouse parallax ───
function useThreeBackground(mountRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 9;

    // Particle field
    const PARTICLE_COUNT = 120;
    const pPositions = new Float32Array(PARTICLE_COUNT * 3);
    const pVelocities: THREE.Vector3[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      pPositions[i*3]   = (Math.random()-0.5) * 18;
      pPositions[i*3+1] = (Math.random()-0.5) * 12;
      pPositions[i*3+2] = (Math.random()-0.5) * 8 - 4;
      pVelocities.push(new THREE.Vector3((Math.random()-.5)*.005,(Math.random()-.5)*.005,0));
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPositions, 3));
    scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xf0ede6, size: 0.055, transparent: true, opacity: 0.55 })));

    const maxLines = PARTICLE_COUNT * 4;
    const linePos  = new Float32Array(maxLines * 6);
    const lineGeo  = new THREE.BufferGeometry();
    lineGeo.setAttribute("position", new THREE.BufferAttribute(linePos, 3));
    scene.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({ color: 0xf0ede6, transparent: true, opacity: 0.08 })));

    // Bauhaus floating shapes
    const shapes = [
      { geo: new THREE.IcosahedronGeometry(1.4, 1), color: 0xe63329, x: 4.2,  y: 2.0,  rx: 0.0025, ry: 0.004  },
      { geo: new THREE.TorusGeometry(1.0, 0.25, 10, 32), color: 0xf5c500, x: 3.8, y:-2.2, rx: 0.004,  ry: 0.0018 },
      { geo: new THREE.OctahedronGeometry(1.2), color: 0x2952a3, x: 1.8, y:-0.5, rx: 0.0015, ry: 0.0035 },
    ].map(d => {
      const mat  = new THREE.MeshBasicMaterial({ color: d.color, wireframe: true, transparent: true, opacity: 0.16 });
      const mesh = new THREE.Mesh(d.geo, mat);
      mesh.position.set(d.x, d.y, -3);
      mesh.userData = { rx: d.rx, ry: d.ry, ox: d.x, oy: d.y };
      scene.add(mesh);
      return mesh;
    });

    // Mouse parallax
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMouseMove = (e: MouseEvent) => {
      mouse.tx =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", onMouseMove);

    let raf: number, t = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.008;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      // Move particles
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pPositions[i*3]   += pVelocities[i].x;
        pPositions[i*3+1] += pVelocities[i].y;
        if (pPositions[i*3]   >  9) pPositions[i*3]   = -9;
        if (pPositions[i*3]   < -9) pPositions[i*3]   =  9;
        if (pPositions[i*3+1] >  6) pPositions[i*3+1] = -6;
        if (pPositions[i*3+1] < -6) pPositions[i*3+1] =  6;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Connection lines
      let lineIdx = 0;
      for (let i = 0; i < PARTICLE_COUNT && lineIdx < maxLines - 1; i++) {
        for (let j = i+1; j < PARTICLE_COUNT && lineIdx < maxLines - 1; j++) {
          const dx = pPositions[i*3]-pPositions[j*3], dy = pPositions[i*3+1]-pPositions[j*3+1];
          if (dx*dx + dy*dy < 12.25) {
            linePos[lineIdx*6]   = pPositions[i*3];   linePos[lineIdx*6+1] = pPositions[i*3+1]; linePos[lineIdx*6+2] = pPositions[i*3+2];
            linePos[lineIdx*6+3] = pPositions[j*3];   linePos[lineIdx*6+4] = pPositions[j*3+1]; linePos[lineIdx*6+5] = pPositions[j*3+2];
            lineIdx++;
          }
        }
      }
      for (let k = lineIdx; k < maxLines; k++) linePos[k*6]=linePos[k*6+1]=linePos[k*6+2]=linePos[k*6+3]=linePos[k*6+4]=linePos[k*6+5]=0;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.setDrawRange(0, lineIdx * 2);

      // Shapes: rotate + float + parallax
      shapes.forEach((m, i) => {
        m.rotation.x += m.userData.rx;
        m.rotation.y += m.userData.ry;
        m.position.y  = m.userData.oy + Math.sin(t + i * 1.2) * 0.3;
        m.position.x  = m.userData.ox + mouse.x * (0.4 + i * 0.15);
      });

      camera.position.x = mouse.x * 0.3;
      camera.position.y = mouse.y * 0.2;
      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    };
    tick();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
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
        @keyframes ticker   { from { transform:translateX(0) } to { transform:translateX(-50%) } }
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
          TICKER — Quick facts marquee
      ══════════════════════════════════════════════ */}
      <div style={{ background: "#111", overflow: "hidden", borderTop: "3px solid #E63329", borderBottom: "3px solid #E63329" }}>
        <div style={{
          display: "flex", whiteSpace: "nowrap",
          animation: "ticker 28s linear infinite",
          willChange: "transform",
        }}>
          {[...Array(2)].map((_, rep) => (
            <div key={rep} style={{ display: "flex", alignItems: "center", gap: 0, flexShrink: 0 }}>
              {[
                { text: "Rising Senior @ Stanford University 🌲", color: "#E63329" },
                { text: "Symbolic Systems · HCI / HAI", color: "#F5C500" },
                { text: "UX/UI Engineer", color: "#2952A3" },
                { text: "From Lambayeque, Peru 🇵🇪", color: "#E63329" },
                { text: "AI Enthusiast & Builder", color: "#F5C500" },
                { text: "10+ Products Shipped", color: "#2952A3" },
                { text: "Open for 2026 Opportunities ✦", color: "#E63329" },
                { text: "Human-Centered Design", color: "#F5C500" },
                { text: "Always Seeking Impact", color: "#2952A3" },
              ].map((item, i) => (
                <span key={i} style={{ display: "inline-flex", alignItems: "center", gap: 0 }}>
                  <span style={{
                    fontFamily: "monospace", fontWeight: 700,
                    fontSize: "clamp(11px, 1.1vw, 14px)",
                    letterSpacing: "0.08em",
                    color: item.color,
                    padding: "clamp(9px,1.2vw,14px) clamp(16px,2.5vw,32px)",
                    textTransform: "uppercase",
                  }}>{item.text}</span>
                  <span style={{ color: "rgba(255,255,255,0.15)", fontSize: 18, padding: "0 4px" }}>•</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          SECTION 2 — Profile card
          ① Bauhaus top  ② Portrait + text  ③ Bauhaus bottom
      ══════════════════════════════════════════════ */}
      <section id="about" ref={posterRef}
        style={{ background: "#F5E6C0", margin: 0, padding: 0, overflow: "hidden" }}>

        {/* ① Top Bauhaus strip */}
        <div style={{
          height: "clamp(120px, 15vw, 190px)",
          backgroundImage: "url('/bauhaus-pattern.svg')",
          backgroundSize: "cover", backgroundPosition: "center top",
        }} />

        {/* ② Portrait + text — flex row, both centered together */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "stretch",
          gap: "clamp(16px, 2vw, 32px)",
          padding: "clamp(20px, 3vw, 40px) clamp(32px, 5vw, 80px)",
          minHeight: "clamp(320px, 42vw, 560px)",
        }}>

          {/* Text — centered column */}
          <div style={{
            flex: "0 0 auto", width: "clamp(240px, 38vw, 480px)",
            display: "flex", flexDirection: "column", justifyContent: "center",
            gap: "clamp(8px, 1.2vw, 16px)",
            animation: posterVisible ? "fadeLeft 0.6s ease 0.05s both" : "none",
          }}>
            <p style={{
              fontFamily: "Georgia, serif", fontStyle: "italic",
              fontSize: "clamp(16px, 2.2vw, 28px)",
              color: "#6B1A1A", margin: 0,
            }}>I&apos;m a</p>

            <div style={{ position: "relative", width: "100%", aspectRatio: "855/427" }}>
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

            <p style={{
              fontFamily: "monospace", fontSize: "clamp(10px, 1vw, 14px)",
              color: "#6B1A1A", margin: 0, letterSpacing: "0.04em",
              display: "flex", alignItems: "center", gap: 6,
            }}>
              From Lambayeque, Peru.
              <img src="/first-screen/peruflag.svg" alt="Peru flag"
                style={{ width: "clamp(18px, 2vw, 28px)", height: "auto", display: "inline-block" }} />
            </p>
          </div>

          {/* Photo — centered, same height as text column */}
          <div style={{
            flex: "0 0 auto", width: "clamp(220px, 36vw, 460px)",
            overflow: "hidden", borderRadius: "clamp(4px, 0.5vw, 8px)",
            animation: posterVisible ? "fadeRight 0.6s ease 0.1s both" : "none",
          }}>
            <img src="/profile-picture.png" alt="Mathias Becerra"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 8%", display: "block" }} />
          </div>
        </div>

        {/* ③ Bottom Bauhaus strip — different pattern */}
        <div style={{
          height: "clamp(120px, 15vw, 190px)",
          backgroundImage: "url('/screen7/bauhaus-top.svg')",
          backgroundSize: "cover", backgroundPosition: "center top",
        }} />
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2b — Mission statement
          Cream throughout, Bauhaus strips top + bottom
      ══════════════════════════════════════════════ */}
      <section style={{ background: "#F5E6C0", overflow: "hidden" }}>

        {/* Top Bauhaus strip */}
        <div style={{
          height: "clamp(100px, 13vw, 170px)",
          backgroundImage: "url('/bauhaus-2.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center bottom",
        }} />

        {/* Text — equal top/bottom padding */}
        <div style={{ padding: "clamp(80px, 11vw, 140px) clamp(40px, 7vw, 100px) clamp(120px, 15vw, 200px)" }}>
          <p style={{
            fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700,
            fontSize: "clamp(26px, 4.2vw, 62px)", lineHeight: 1.2,
            color: "#1a1a1a", margin: 0,
          }}>
            {"I "}
            <span key={wordIdx} style={{
              display: "inline",
              color: "#6B1A1A", fontStyle: "italic",
              opacity: wordExit ? 0 : 1,
              transition: "opacity 0.26s ease",
            }}>
              {WORDS[wordIdx]}
            </span>
            {" products with meticulous attention to detail to create accessible user experiences for social good"}
          </p>
        </div>

        {/* Bottom Bauhaus strip */}
        <div style={{
          height: "clamp(100px, 13vw, 170px)",
          backgroundImage: "url('/bauhaus-pattern.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          transform: "scaleY(-1)",
        }} />
      </section>

      <ThirdScreen />
      <FourthScreen />
      <FifthScreen />
      <SixthScreen />
      <SeventhScreen />
      <EighthScreen />
    </div>
  );
}
