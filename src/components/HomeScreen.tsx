"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import ThirdScreen from "./ThirdScreen";
import FourthScreen from "./FourthScreen";
import FifthScreen from "./FifthScreen";
import SixthScreen from "./SixthScreen";
import SeventhScreen from "./SeventhScreen";
import EighthScreen from "./EighthScreen";

const NAV = [
  { label: "Home",       href: "#home"       },
  { label: "About",      href: "#about"      },
  { label: "Process",    href: "#process"    },
  { label: "Experience", href: "/experience"  },
  { label: "Impact",     href: "#impact"     },
  { label: "Contact",    href: "#contact"    },
];

const GREETINGS = [
  { text: "Allinllachu.", lang: "Quechua", script: "Latin" },
  { text: "Hello.", lang: "English", script: "Latin" },
  { text: "Bonjour.", lang: "French", script: "Latin" },
  { text: "こんにちは。", lang: "Japanese", script: "Kanji" },
  { text: "مرحباً.", lang: "Arabic", script: "Arabic" },
  { text: "안녕하세요.", lang: "Korean", script: "Hangul" },
  { text: "नमस्ते.", lang: "Hindi", script: "Devanagari" },
  { text: "Привет.", lang: "Russian", script: "Cyrillic" },
  { text: "שָׁלוֹם.", lang: "Hebrew", script: "Hebrew" },
  { text: "Hola.", lang: "Spanish", script: "Latin" },
  { text: "สวัสดี.", lang: "Thai", script: "Thai" },
  { text: "Merhaba.", lang: "Turkish", script: "Latin" },
  { text: "Olá.", lang: "Portuguese", script: "Latin" },
];

const ROLES = [
  { src: "/first-screen/role-uxui.svg", label: "UX/UI Engineer" },
  { src: "/first-screen/role-data.svg", label: "Data Scientist" },
  { src: "/first-screen/role-product.svg", label: "Product Designer" },
  { src: "/first-screen/role-fullstack.svg", label: "Fullstack Developer" },
];

const WORDS = ["design", "build", "program"];

// ── Three.js — interactive neural brain network ────────────────
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

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 9;

    // ── Neural brain nodes distributed on a sphere ─────────────
    const N = 180;
    const basePos    = new Float32Array(N * 3); // original sphere positions
    const currentPos = new Float32Array(N * 3);
    const nodeColors = new Float32Array(N * 3);
    const BAUHAUS = [
      [0.902, 0.2,   0.161], // red   #E63329
      [0.961, 0.773, 0.0],   // yellow #F5C500
      [0.161, 0.322, 0.639], // blue  #2952A3
      [0.941, 0.941, 0.906], // cream #F0EDE6
    ];
    const R = 3.2;
    for (let i = 0; i < N; i++) {
      const theta = Math.acos(2 * Math.random() - 1);
      const phi   = Math.random() * Math.PI * 2;
      const r     = R * (0.85 + Math.random() * 0.3);
      basePos[i*3]   = r * Math.sin(theta) * Math.cos(phi);
      basePos[i*3+1] = r * Math.sin(theta) * Math.sin(phi);
      basePos[i*3+2] = r * Math.cos(theta);
      currentPos[i*3]   = basePos[i*3];
      currentPos[i*3+1] = basePos[i*3+1];
      currentPos[i*3+2] = basePos[i*3+2];
      const c = BAUHAUS[i % BAUHAUS.length];
      nodeColors[i*3] = c[0]; nodeColors[i*3+1] = c[1]; nodeColors[i*3+2] = c[2];
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute("position", new THREE.BufferAttribute(currentPos, 3));
    nodeGeo.setAttribute("color",    new THREE.BufferAttribute(nodeColors, 3));
    const nodeMat = new THREE.PointsMaterial({
      vertexColors: true, size: 0.09,
      transparent: true, opacity: 0.75,
    });
    scene.add(new THREE.Points(nodeGeo, nodeMat));

    // ── Connections ─────────────────────────────────────────────
    const MAX_CONN = N * 6;
    const connPos  = new Float32Array(MAX_CONN * 6);
    const connGeo  = new THREE.BufferGeometry();
    connGeo.setAttribute("position", new THREE.BufferAttribute(connPos, 3));
    const connMat = new THREE.LineBasicMaterial({
      color: 0xf0ede6, transparent: true, opacity: 0.06,
    });
    const connLines = new THREE.LineSegments(connGeo, connMat);
    scene.add(connLines);

    // ── Subtle Bauhaus wireframe orb ────────────────────────────
    const orbGeo  = new THREE.IcosahedronGeometry(R * 1.05, 2);
    const orbMat  = new THREE.MeshBasicMaterial({ color: 0xf0ede6, wireframe: true, transparent: true, opacity: 0.03 });
    scene.add(new THREE.Mesh(orbGeo, orbMat));

    // ── Interaction ─────────────────────────────────────────────
    const mouse = { x: 0, y: 0, tx: 0, ty: 0, clicked: false };
    let clickRipple = 0; // 0..1 fade

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.tx =  (e.clientX / window.innerWidth  - 0.5) * 2.5;
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2.5;
    };
    const onClick = () => { clickRipple = 1.0; };
    window.addEventListener("mousemove", onMouseMove);
    mount.addEventListener("click", onClick);
    mount.style.cursor = "crosshair";

    let raf: number, t = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.005;

      // Smooth mouse lerp
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;

      // Decay ripple
      if (clickRipple > 0) clickRipple -= 0.025;

      // Rotate brain group around Y-axis slowly
      const rotY = t * 0.12 + mouse.x * 0.4;
      const rotX = mouse.y * 0.3;

      // Update node positions: rotate base positions + ripple distortion
      for (let i = 0; i < N; i++) {
        const bx = basePos[i*3], by = basePos[i*3+1], bz = basePos[i*3+2];
        // Rotate around Y
        const cx = bx * Math.cos(rotY) + bz * Math.sin(rotY);
        const cy = by * Math.cos(rotX) - bz * Math.sin(rotX);
        const cz = -bx * Math.sin(rotY) + bz * Math.cos(rotY);
        // Click ripple: radial pulse outward
        const rippleScale = 1 + clickRipple * 0.35 * Math.sin(t * 18 + i * 0.4);
        currentPos[i*3]   = cx * rippleScale;
        currentPos[i*3+1] = cy * rippleScale;
        currentPos[i*3+2] = cz;
      }
      nodeGeo.attributes.position.needsUpdate = true;

      // Connections — dynamic based on distance
      let ci = 0;
      const THRESH = 2.8 * 2.8;
      for (let i = 0; i < N && ci < MAX_CONN - 1; i++) {
        for (let j = i + 1; j < N && ci < MAX_CONN - 1; j++) {
          const dx = currentPos[i*3] - currentPos[j*3];
          const dy = currentPos[i*3+1] - currentPos[j*3+1];
          const dz = currentPos[i*3+2] - currentPos[j*3+2];
          if (dx*dx + dy*dy + dz*dz < THRESH) {
            connPos[ci*6]   = currentPos[i*3];   connPos[ci*6+1] = currentPos[i*3+1]; connPos[ci*6+2] = currentPos[i*3+2];
            connPos[ci*6+3] = currentPos[j*3];   connPos[ci*6+4] = currentPos[j*3+1]; connPos[ci*6+5] = currentPos[j*3+2];
            ci++;
          }
        }
      }
      for (let k = ci; k < MAX_CONN; k++)
        connPos[k*6] = connPos[k*6+1] = connPos[k*6+2] = connPos[k*6+3] = connPos[k*6+4] = connPos[k*6+5] = 0;
      connGeo.attributes.position.needsUpdate = true;
      connGeo.setDrawRange(0, ci * 2);

      // Connection opacity reacts to ripple
      (connLines.material as THREE.LineBasicMaterial).opacity = 0.06 + clickRipple * 0.18;

      // Camera subtle drift
      camera.position.x = mouse.x * 0.5;
      camera.position.y = mouse.y * 0.4;
      camera.lookAt(0, 0, 0);

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
      mount.removeEventListener("click", onClick);
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
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

// ── HomeScreen ────────────────────────────────────────────────
export default function HomeScreen({ visible }: { visible: boolean }) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const posterRef = useRef<HTMLElement | null>(null);
  const [idx, setIdx] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [roleIdx, setRoleIdx] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [greetExit, setGreetExit] = useState(false);
  const [roleExit, setRoleExit] = useState(false);
  const [wordExit, setWordExit] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const posterVisible = useReveal(posterRef as RefObject<HTMLElement>);

  useThreeBackground(mountRef);

  useEffect(() => {
    if (visible) setTimeout(() => setFadeIn(true), 100);
  }, [visible]);

  // Greeting cycles every 2.2s
  useEffect(() => {
    const t = setInterval(() => {
      setGreetExit(true);
      setTimeout(() => {
        setIdx((p) => (p + 1) % GREETINGS.length);
        setAnimKey((p) => p + 1);
        setGreetExit(false);
      }, 300);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  // Role + word cycle every 3s
  useEffect(() => {
    const t = setInterval(() => {
      setRoleExit(true);
      setWordExit(true);
      setTimeout(() => {
        setRoleIdx((p) => (p + 1) % ROLES.length);
        setWordIdx((p) => (p + 1) % WORDS.length);
        setRoleExit(false);
        setWordExit(false);
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
      <section id="home"
        className="relative flex flex-col overflow-hidden bg-[#0d0d0d]"
        style={{ height: "100svh", minHeight: 600, padding: "3vh 6vw 2vh" }}
      >
        {/* Subtle Bauhaus corner accents */}
        <div style={{ position:"absolute", top:0, right:0, width:"clamp(60px,8vw,100px)", height:"clamp(60px,8vw,100px)", background:"#E63329", opacity:0.07, zIndex:0 }} />
        <div style={{ position:"absolute", bottom:0, left:0, width:"clamp(80px,10vw,130px)", height:"clamp(80px,10vw,130px)", borderRadius:"0 100% 0 0", background:"#2952A3", opacity:0.08, zIndex:0 }} />
        <div style={{ position:"absolute", bottom:"8%", right:"5%", width:"clamp(40px,5vw,70px)", height:"clamp(40px,5vw,70px)", borderRadius:"50%", background:"#F5C500", opacity:0.07, zIndex:0 }} />
        <div style={{ position:"absolute", top:"20%", left:"3%", width:3, height:"clamp(60px,8vh,100px)", background:"#E63329", opacity:0.18, zIndex:0 }} />
        <div
          ref={mountRef}
          className="absolute inset-0 z-0 pointer-events-none"
          style={{ left: "45%" }}
        />
        <div
          className="absolute inset-0 z-[1] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)",
            backgroundSize: "100px 100%",
          }}
        />

        {/* Nav — plain links, no background image */}
        <nav className="relative z-10 flex justify-between items-center mb-auto pb-4">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center font-mono font-bold text-white text-sm"
              style={{
                width: 36,
                height: 36,
                background: "#2952A3",
                borderRadius: 4,
                letterSpacing: "0.05em",
              }}
            >
              MB
            </div>
            <span className="text-xs uppercase tracking-[0.1em] text-[#f0ede6]/80">
              Portfolio
            </span>
          </div>
          <div className="flex gap-6 font-mono text-sm text-[#f0ede6]/90 tracking-[0.22em] uppercase">
            {NAV.map((n) => (
              <a
                key={n.label}
                href={n.href}
                className="hover:text-[#f0ede6] transition-colors"
              >
                {n.label}
              </a>
            ))}
          </div>
        </nav>

        {/* Greeting + name */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div
            className="overflow-hidden"
            style={{ lineHeight: 1.05, direction: isRTL ? "rtl" : "ltr" }}
          >
            <span
              key={animKey}
              className="block font-mono text-[#f0ede6]"
              style={{
                fontSize: "clamp(50px, 10vw, 140px)",
                opacity: greetExit ? 0 : 1,
                transform: greetExit ? "translateY(-28px)" : undefined,
                transition: greetExit
                  ? "opacity 0.28s ease, transform 0.28s ease"
                  : "none",
                animation: !greetExit
                  ? "greetIn 0.42s cubic-bezier(0.22,1,0.36,1) forwards"
                  : "none",
              }}
            >
              {GREETINGS[idx].text}
            </span>
          </div>
          <p
            className="font-mono text-[#f0ede6] leading-none mt-1"
            style={{ fontSize: "clamp(32px, 5.5vw, 88px)" }}
          >
            I&apos;M
          </p>
          <h1
            className="font-mono font-bold text-[#f0ede6] leading-none tracking-tight"
            style={{ fontSize: "clamp(44px, 7.5vw, 118px)" }}
          >
            MATHIAS.
          </h1>
          <p className="mt-4 font-mono tracking-[0.3em] uppercase text-[#f0ede6]/90"
            style={{ fontSize: "clamp(11px, 1.1vw, 15px)", letterSpacing: "0.3em" }}>
            {GREETINGS[idx].lang} · {GREETINGS[idx].script}
          </p>
        </div>

        {/* Scroll hint */}
        <div className="relative z-10 flex items-center gap-3 pb-2">
          <div
            style={{
              width: 1,
              height: 36,
              background: "rgba(240,237,230,0.25)",
            }}
          />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#f0ede6]/80">
            scroll
          </span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          TICKER — Quick facts marquee
      ══════════════════════════════════════════════ */}
      <div
        style={{
          background: "#111",
          overflow: "hidden",
          borderTop: "3px solid #E63329",
          borderBottom: "3px solid #E63329",
        }}
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "ticker 28s linear infinite",
            willChange: "transform",
          }}
        >
          {[...Array(2)].map((_, rep) => (
            <div
              key={rep}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 0,
                flexShrink: 0,
              }}
            >
              {[
                {
                  text: "Rising Senior @ Stanford University 🌲",
                  color: "#E63329",
                },
                { text: "Symbolic Systems · HCI / HAI", color: "#F5C500" },
                { text: "UX/UI Engineer", color: "#2952A3" },
                { text: "From Lambayeque, Peru 🇵🇪", color: "#E63329" },
                { text: "AI Enthusiast & Builder", color: "#F5C500" },
                { text: "10+ Products Shipped", color: "#2952A3" },
                { text: "Open for 2026 Opportunities ✦", color: "#E63329" },
                { text: "Human-Centered Design", color: "#F5C500" },
                { text: "Always Seeking Impact", color: "#2952A3" },
              ].map((item, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontWeight: 700,
                      fontSize: "clamp(11px, 1.1vw, 14px)",
                      letterSpacing: "0.08em",
                      color: item.color,
                      padding: "clamp(9px,1.2vw,14px) clamp(16px,2.5vw,32px)",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.text}
                  </span>
                  <span
                    style={{
                      color: "rgba(255,255,255,0.15)",
                      fontSize: 18,
                      padding: "0 4px",
                    }}
                  >
                    •
                  </span>
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
      <section
        id="about"
        ref={posterRef}
        style={{
          background: "#F5E6C0",
          margin: 0,
          padding: 0,
          overflow: "hidden",
        }}
      >
        {/* ① Top Bauhaus strip */}
        <div
          style={{
            height: "clamp(120px, 15vw, 190px)",
            backgroundImage: "url('/bauhaus-pattern.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />

        {/* ② Portrait + text — photo fills full height touching both strips */}
        <div style={{ position: "relative", minHeight: "clamp(360px, 48vw, 640px)" }}>

          {/* Photo — position absolute, full height right 45% */}
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: "45%",
            overflow: "hidden",
            animation: posterVisible ? "fadeRight 0.6s ease 0.1s both" : "none",
          }}>
            <img src="/profile-picture.png" alt="Mathias Becerra"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 8%", display: "block" }} />
          </div>

          {/* Text — left 58%, vertically centered */}
          <div
            style={{
              position: "absolute", top: 0, left: 0, bottom: 0, width: "58%",
              padding: "clamp(24px, 3vw, 48px) clamp(32px, 5vw, 80px)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "clamp(10px, 1.4vw, 20px)",
              animation: posterVisible
                ? "fadeLeft 0.6s ease 0.05s both"
                : "none",
            }}
          >
            <p
              style={{
                fontFamily: "Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(32px, 5vw, 52px)",
                color: "#6B1A1A",
                margin: 0,
              }}
            >
              I&apos;m a
            </p>

            <div
              style={{
                position: "relative",
                width: "100%",
                aspectRatio: "855/427",
              }}
            >
              {ROLES.map((role, i) => (
                <img
                  key={role.src}
                  src={role.src}
                  alt={role.label}
                  style={{
                    position: i === 0 ? "relative" : "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "auto",
                    display: "block",
                    opacity: roleIdx === i ? (roleExit ? 0 : 1) : 0,
                    transform:
                      roleIdx === i
                        ? roleExit
                          ? "translateY(-8px)"
                          : "translateY(0)"
                        : "translateY(8px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    pointerEvents: roleIdx === i ? "auto" : "none",
                  }}
                />
              ))}
            </div>

            <p
              style={{
                fontFamily: "monospace",
                fontSize: "clamp(16px, 2vw, 26px)",
                color: "#6B1A1A",
                margin: 0,
                letterSpacing: "0.04em",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              From Lambayeque, Peru.
              <img
                src="/first-screen/peruflag.svg"
                alt="Peru flag"
                style={{
                  width: "clamp(24px, 3vw, 38px)",
                  height: "auto",
                  display: "inline-block",
                }}
              />
            </p>
          </div>

        </div>

        {/* ③ Bottom Bauhaus strip — different pattern */}
        <div
          style={{
            height: "clamp(120px, 15vw, 190px)",
            backgroundImage: "url('/screen7/bauhaus-top.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
          }}
        />
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2b — Mission statement
          Cream throughout, Bauhaus strips top + bottom
      ══════════════════════════════════════════════ */}
      <section style={{ background: "#F5E6C0", overflow: "hidden" }}>
        {/* Top Bauhaus strip */}
        <div
          style={{
            height: "clamp(100px, 13vw, 170px)",
            backgroundImage: "url('/bauhaus-2.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        />

        {/* Text — equal top/bottom padding */}
        <div
          style={{
            padding:
              "clamp(80px, 11vw, 140px) clamp(40px, 7vw, 100px) clamp(120px, 15vw, 200px)",
          }}
        >
          <p
            style={{
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontWeight: 700,
              fontSize: "clamp(26px, 4.2vw, 62px)",
              lineHeight: 1.2,
              color: "#1a1a1a",
              margin: 0,
            }}
          >
            {"I "}
            <span
              key={wordIdx}
              style={{
                display: "inline",
                color: "#6B1A1A",
                fontStyle: "italic",
                opacity: wordExit ? 0 : 1,
                transition: "opacity 0.26s ease",
              }}
            >
              {WORDS[wordIdx]}
            </span>
            {
              " products with meticulous attention to detail to create accessible user experiences for social good"
            }
          </p>
        </div>

        {/* Bottom Bauhaus strip */}
        <div
          style={{
            height: "clamp(100px, 13vw, 170px)",
            backgroundImage: "url('/bauhaus-pattern.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            transform: "scaleY(-1)",
          }}
        />
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
