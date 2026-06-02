"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// ── Greetings in different languages ────────────────────────────
const GREETINGS = [
  { text: "allinllachu.", lang: "Quechua" },
  { text: "hello.",       lang: "English" },
  { text: "bonjour.",     lang: "French" },
  { text: "hola.",        lang: "Spanish" },
  { text: "ciao.",        lang: "Italian" },
  { text: "你好.",         lang: "Mandarin" },
  { text: "merhaba.",     lang: "Turkish" },
  { text: "hei.",         lang: "Norwegian" },
  { text: "olá.",         lang: "Portuguese" },
  { text: "سلام.",        lang: "Farsi" },
];

// ── Three.js background ─────────────────────────────────────────
function useThreeBackground(mountRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth;
    const H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 8;

    // Wireframe geometries — Bauhaus colors, very subtle
    const shapes: THREE.Mesh[] = [];
    const defs = [
      { geo: new THREE.IcosahedronGeometry(1.8, 1),  color: 0xE63329, x:  5, y:  2.5, z: -2,  rx: 0.003, ry: 0.005 },
      { geo: new THREE.OctahedronGeometry(1.4),       color: 0x2952A3, x: -5, y: -2.5, z: -3,  rx: 0.004, ry: 0.003 },
      { geo: new THREE.TorusGeometry(1.2, 0.3, 8, 24),color: 0xF5A623, x:  5.5, y: -3, z: -4,  rx: 0.006, ry: 0.002 },
      { geo: new THREE.BoxGeometry(1.6, 1.6, 1.6),    color: 0xf0ede6, x: -5.5, y: 3,  z: -5,  rx: 0.002, ry: 0.006 },
    ];

    defs.forEach(d => {
      const mat  = new THREE.MeshBasicMaterial({ color: d.color, wireframe: true, opacity: 0.12, transparent: true });
      const mesh = new THREE.Mesh(d.geo, mat);
      mesh.position.set(d.x, d.y, d.z);
      // store rotation speeds in userData
      mesh.userData = { rx: d.rx, ry: d.ry };
      scene.add(mesh);
      shapes.push(mesh);
    });

    let raf: number;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      shapes.forEach(m => {
        m.rotation.x += m.userData.rx;
        m.rotation.y += m.userData.ry;
      });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [mountRef]);
}

// ── Greeting text with slide animation ─────────────────────────
function GreetingText({ text, state }: { text: string; state: "enter" | "visible" | "exit" }) {
  const style: React.CSSProperties = {
    display: "block",
    transform:
      state === "enter"   ? "translateY(100%)" :
      state === "exit"    ? "translateY(-110%)" :
      "translateY(0)",
    opacity: state === "visible" ? 1 : 0,
    transition:
      state === "enter"   ? "none" :
      state === "exit"    ? "transform 0.45s cubic-bezier(0.55,0,1,0.45), opacity 0.3s ease" :
      "transform 0.55s cubic-bezier(0,0,0.2,1), opacity 0.4s ease",
  };
  return <span style={style}>{text}</span>;
}

// ── Main HomeScreen ─────────────────────────────────────────────
export default function HomeScreen({ visible }: { visible: boolean }) {
  const mountRef  = useRef<HTMLDivElement>(null);
  const [idx,      setIdx]      = useState(0);
  const [animState, setAnimState] = useState<"enter" | "visible" | "exit">("enter");
  const [contentIn, setContentIn] = useState(false);

  useThreeBackground(mountRef);

  // Fade in content when screen becomes visible
  useEffect(() => {
    if (visible) setTimeout(() => setContentIn(true), 200);
  }, [visible]);

  // Kick off first greeting
  useEffect(() => {
    const t = setTimeout(() => setAnimState("visible"), 50);
    return () => clearTimeout(t);
  }, []);

  // Cycle greetings
  useEffect(() => {
    if (animState !== "visible") return;
    const hold = setTimeout(() => {
      // exit
      setAnimState("exit");
      setTimeout(() => {
        setIdx(prev => (prev + 1) % GREETINGS.length);
        setAnimState("enter");
        setTimeout(() => setAnimState("visible"), 40);
      }, 480);
    }, 2000);
    return () => clearTimeout(hold);
  }, [animState, idx]);

  return (
    <div
      className="relative min-h-screen bg-[#0d0d0d] overflow-hidden"
      style={{
        opacity: contentIn ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
    >
      {/* Three.js background */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" />

      {/* Subtle vertical grid lines */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "120px 100%",
        }}
      />

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col min-h-screen px-[5vw] py-[4vh]">

        {/* Top nav */}
        <nav className="flex justify-between items-center mb-auto">
          <span className="font-mono text-[#f0ede6]/30 text-sm tracking-widest uppercase">
            mathbecsan
          </span>
          <div className="flex gap-8 font-mono text-sm text-[#f0ede6]/40 tracking-wide">
            <a href="#work"    className="hover:text-[#f0ede6] transition-colors">work</a>
            <a href="#about"   className="hover:text-[#f0ede6] transition-colors">about</a>
            <a href="#contact" className="hover:text-[#f0ede6] transition-colors">contact</a>
          </div>
        </nav>

        {/* Hero */}
        <div className="flex-1 flex flex-col justify-center pt-[6vh]">
          {/* Greeting — animated */}
          <div
            className="overflow-hidden leading-none"
            style={{ fontSize: "clamp(64px, 11vw, 160px)" }}
          >
            <GreetingText text={GREETINGS[idx].text} state={animState} />
          </div>

          {/* i'm */}
          <div
            className="font-mono text-[#f0ede6] leading-none mt-1"
            style={{ fontSize: "clamp(48px, 8vw, 120px)" }}
          >
            i&apos;m
          </div>

          {/* Name */}
          <div
            className="font-mono font-bold text-[#f0ede6] leading-none tracking-tight"
            style={{ fontSize: "clamp(56px, 9.5vw, 140px)" }}
          >
            mathias.
          </div>

          {/* Language tag */}
          <div className="mt-3 font-mono text-xs tracking-[0.25em] uppercase text-[#f0ede6]/25">
            {GREETINGS[idx].lang}
          </div>
        </div>

        {/* Bio + CTA */}
        <div className="mt-auto pb-[4vh]">
          <p
            className="font-mono text-[#f0ede6]/75 leading-relaxed max-w-[640px]"
            style={{ fontSize: "clamp(14px, 1.4vw, 20px)" }}
          >
            I&apos;m a software engineer studying Symbolic Systems at Stanford.
            My passion is creating experiences at the intersection of
            technology, language, and human connection.
          </p>

          <div className="mt-8 flex items-center gap-6">
            <a
              href="mailto:mathias@stanford.edu"
              className="font-mono border border-[#f0ede6]/40 rounded-full px-8 py-3 text-[#f0ede6] hover:bg-[#f0ede6] hover:text-[#0d0d0d] transition-all duration-300"
              style={{ fontSize: "clamp(14px, 1.2vw, 18px)" }}
            >
              → say hi
            </a>
            <span className="font-mono text-xs tracking-widest text-[#f0ede6]/20 uppercase">
              stanford, ca
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
