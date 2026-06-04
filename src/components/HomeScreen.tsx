"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import { data } from "../brain-data";
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

// ── Build CatmullRom brain curves from data ────────────────────
function buildBrainCurves(): THREE.CatmullRomCurve3[] {
  const paths = data.economics[0].paths;
  return paths.map(path => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < path.length; i += 3)
      pts.push(new THREE.Vector3(path[i], path[i+1], path[i+2]));
    return new THREE.CatmullRomCurve3(pts);
  });
}

// ── Three.js — real anatomical brain (drag to rotate) ──────────
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
    // Camera matches original: z=0.3, near=0.001, far=5 — scaled up x30
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.001, 150);
    camera.position.z = 9;

    // ── Build real anatomical brain curves ─────────────────────
    const curves = buildBrainCurves();
    const brainGroup = new THREE.Group();
    scene.add(brainGroup);

    // Scale the brain to fill the viewport (original data is ~0.0-0.3 range)
    brainGroup.scale.setScalar(30);

    // ── Tube meshes with glowing shader ───────────────────────
    const tubeMat = new THREE.ShaderMaterial({
      uniforms: {
        time:  { value: 0 },
        color: { value: new THREE.Color(0.1, 0.3, 0.6) },
        mouse: { value: new THREE.Vector3() },
      },
      vertexShader: `
        varying vec2 vUv;
        uniform float time;
        uniform vec3 mouse;
        varying float vProgress;
        void main() {
          vUv = uv;
          vProgress = smoothstep(-1., 1., sin(vUv.x * 8. + time * 3.));
          vec3 p = position;
          float maxDist = 0.05;
          float dist = length(mouse - p);
          if (dist < maxDist) {
            vec3 dir = normalize(mouse - p);
            dir *= 1. - dist / maxDist;
            p -= dir * 0.03;
          }
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        varying float vProgress;
        void main() {
          float hideCorners1 = smoothstep(1., 0.9, vUv.x);
          float hideCorners2 = smoothstep(0., 0.1, vUv.x);
          vec3 finalColor = mix(color, color * 0.25, vProgress);
          gl_FragColor = vec4(finalColor, hideCorners1 * hideCorners2);
        }
      `,
      side: THREE.DoubleSide,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    // Bauhaus three-color palette — red, yellow, blue cycling per curve
    const BRAIN_COLORS = [
      new THREE.Color(0xe63329), // Bauhaus red
      new THREE.Color(0xf5c500), // Bauhaus yellow
      new THREE.Color(0x2952a3), // Bauhaus blue
    ];
    curves.forEach((curve, i) => {
      const geo  = new THREE.TubeGeometry(curve, 64, 0.001, 2, false);
      const mat  = tubeMat.clone();
      mat.uniforms.color.value = BRAIN_COLORS[i % 3];
      brainGroup.add(new THREE.Mesh(geo, mat));
    });

    // ── Particles travelling along curves ─────────────────────
    const DENSITY = 10;
    const nParticles = DENSITY * curves.length;
    const pPos = new Float32Array(nParticles * 3);

    interface PInfo { cur: number; speed: number; curve: THREE.CatmullRomCurve3 }
    const pInfo: PInfo[] = [];
    curves.forEach(curve => {
      for (let j = 0; j < DENSITY; j++) {
        pInfo.push({ cur: Math.random(), speed: Math.random() * 0.003 + 0.001, curve });
      }
    });
    const randoms = new Float32Array(nParticles).map(() => 0.3 + Math.random() * 0.7);

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("randoms",  new THREE.BufferAttribute(randoms, 1));

    const pMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec2 vUv;
        uniform float time;
        attribute float randoms;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          vec4 mvPos = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = randoms * 2. * (1. / -mvPos.z);
        }
      `,
      fragmentShader: `
        void main() {
          float disc = length(gl_PointCoord.xy - vec2(0.5));
          float opacity = 0.4 * smoothstep(0.5, 0.4, disc);
          gl_FragColor = vec4(vec3(opacity), 1.0);
        }
      `,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    brainGroup.add(new THREE.Points(pGeo, pMat));

    // ── Drag rotation ─────────────────────────────────────────
    const drag = { active: false, lastX: 0, lastY: 0, rotX: 0, rotY: 0, velX: 0, velY: 0.003 };

    const onPointerDown = (e: PointerEvent) => {
      drag.active = true; drag.lastX = e.clientX; drag.lastY = e.clientY;
      drag.velX = 0; drag.velY = 0; mount.style.cursor = "grabbing";
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!drag.active) return;
      drag.velY = (e.clientX - drag.lastX) * 0.008;
      drag.velX = (e.clientY - drag.lastY) * 0.008;
      drag.rotY += drag.velY; drag.rotX += drag.velX;
      drag.rotX = Math.max(-1.2, Math.min(1.2, drag.rotX));
      drag.lastX = e.clientX; drag.lastY = e.clientY;
    };
    const onPointerUp = () => { drag.active = false; mount.style.cursor = "grab"; };

    mount.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup",   onPointerUp);
    mount.style.cursor = "grab";

    // ── Animate ───────────────────────────────────────────────
    let raf: number, elapsed = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      elapsed += 0.01;

      // Inertia
      if (!drag.active) {
        drag.velY += (0.003 - drag.velY) * 0.02;
        drag.velX += (0 - drag.velX) * 0.05;
        drag.rotY += drag.velY; drag.rotX += drag.velX;
      }
      brainGroup.rotation.y = drag.rotY;
      brainGroup.rotation.x = drag.rotX;

      // Update tube time uniform
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh) {
          const mat = obj.material as THREE.ShaderMaterial;
          if (mat.uniforms?.time) mat.uniforms.time.value = elapsed;
        }
      });

      // Move particles along curves
      for (let i = 0; i < pInfo.length; i++) {
        pInfo[i].cur = (pInfo[i].cur + pInfo[i].speed) % 1;
        const pt = pInfo[i].curve.getPointAt(pInfo[i].cur);
        pPos[i*3] = pt.x; pPos[i*3+1] = pt.y; pPos[i*3+2] = pt.z;
      }
      pGeo.attributes.position.needsUpdate = true;
      pMat.uniforms.time.value = elapsed;

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
      mount.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup",   onPointerUp);
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
