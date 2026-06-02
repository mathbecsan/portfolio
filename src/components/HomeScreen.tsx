"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const GREETINGS = [
  { text: "Allinllachu.", lang: "Quechua"    },
  { text: "Hello.",       lang: "English"    },
  { text: "Bonjour.",     lang: "French"     },
  { text: "Hola.",        lang: "Spanish"    },
  { text: "Ciao.",        lang: "Italian"    },
  { text: "你好.",         lang: "Mandarin"   },
  { text: "Merhaba.",     lang: "Turkish"    },
  { text: "Hei.",         lang: "Norwegian"  },
  { text: "Olá.",         lang: "Portuguese" },
];

// ── Three.js — subtle rotating wireframes in right half ────────
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
    const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 100);
    camera.position.z = 9;

    const shapes: THREE.Mesh[] = [];
    const defs = [
      { geo: new THREE.IcosahedronGeometry(1.6, 1), color: 0xE63329, x:  3.5, y:  2,   z: -2,  rx: 0.003, ry: 0.005 },
      { geo: new THREE.TorusGeometry(1.1, 0.3, 8, 24), color: 0xF5A623, x:  4,   y: -2.5, z: -3,  rx: 0.005, ry: 0.002 },
      { geo: new THREE.OctahedronGeometry(1.3),      color: 0x2952A3, x:  2,   y: -0.5, z: -4,  rx: 0.002, ry: 0.004 },
    ];

    defs.forEach(d => {
      const mat  = new THREE.MeshBasicMaterial({ color: d.color, wireframe: true, opacity: 0.14, transparent: true });
      const mesh = new THREE.Mesh(d.geo, mat);
      mesh.position.set(d.x, d.y, d.z);
      mesh.userData = { rx: d.rx, ry: d.ry };
      scene.add(mesh);
      shapes.push(mesh);
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

// ── Main HomeScreen ─────────────────────────────────────────────
export default function HomeScreen({ visible }: { visible: boolean }) {
  const mountRef  = useRef<HTMLDivElement>(null);
  const [idx,       setIdx]      = useState(0);
  const [animKey,   setAnimKey]  = useState(0); // re-mount span to retrigger CSS anim
  const [exiting,   setExiting]  = useState(false);
  const [contentIn, setContentIn] = useState(false);

  useThreeBackground(mountRef);

  useEffect(() => {
    if (visible) setTimeout(() => setContentIn(true), 100);
  }, [visible]);

  // Cycle greetings
  useEffect(() => {
    const interval = setInterval(() => {
      setExiting(true);
      setTimeout(() => {
        setIdx(prev => (prev + 1) % GREETINGS.length);
        setAnimKey(prev => prev + 1);
        setExiting(false);
      }, 380);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative min-h-screen bg-[#0d0d0d] overflow-hidden"
      style={{ opacity: contentIn ? 1 : 0, transition: "opacity 0.8s ease" }}
    >
      {/* CSS keyframe for greeting slide-in */}
      <style>{`
        @keyframes greetingIn {
          from { transform: translateY(110%); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
      `}</style>

      {/* Three.js — right side only */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ left: "45%" }}  /* only covers right half so it never overlaps text */
      />

      {/* Subtle vertical lines */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "100px 100%",
        }}
      />

      {/* ── Content ─────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col min-h-screen" style={{ padding: "3vh 6vw" }}>

        {/* Nav */}
        <nav className="flex justify-between items-center w-full mb-8">
          <span className="font-mono text-[#f0ede6]/30 text-xs tracking-[0.25em] uppercase">
            mathbecsan
          </span>
          <div className="flex gap-10 font-mono text-sm text-[#f0ede6]/40 tracking-wide">
            {["work","about","contact"].map(l => (
              <a key={l} href={`#${l}`} className="hover:text-[#f0ede6] transition-colors">{l}</a>
            ))}
          </div>
        </nav>

        {/* Hero + Bio — all together, vertically centered */}
        <div className="flex-1 flex flex-col justify-center gap-0">

          {/* Greeting */}
          <div className="overflow-hidden" style={{ lineHeight: 1.05 }}>
            <span
              key={animKey}
              className="block font-mono text-[#f0ede6] whitespace-nowrap"
              style={{
                fontSize: "clamp(48px, 8.5vw, 130px)",
                opacity: exiting ? 0 : 1,
                transform: exiting ? "translateY(-30px)" : "translateY(0)",
                transition: exiting ? "opacity 0.3s ease, transform 0.3s ease" : "none",
                animation: !exiting ? "greetingIn 0.5s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
              }}
            >
              {GREETINGS[idx].text}
            </span>
          </div>

          {/* i'm */}
          <p className="font-mono text-[#f0ede6] leading-none mt-1"
            style={{ fontSize: "clamp(36px, 6vw, 96px)" }}>
            i&apos;m
          </p>

          {/* Name */}
          <h1 className="font-mono font-bold text-[#f0ede6] leading-none tracking-tight"
            style={{ fontSize: "clamp(48px, 8vw, 128px)" }}>
            mathias.
          </h1>

          {/* Language label */}
          <p className="mt-2 font-mono text-xs tracking-[0.3em] uppercase text-[#f0ede6]/25">
            {GREETINGS[idx].lang}
          </p>

          {/* Bio — directly below language tag, no large gap */}
          <div className="mt-6 max-w-[600px]">
            <p className="font-mono text-[#f0ede6]/70 leading-relaxed"
              style={{ fontSize: "clamp(13px, 1.2vw, 17px)" }}>
              I&apos;m a software engineer studying Symbolic Systems at Stanford.
              My passion is creating experiences at the intersection of
              technology, language, and human connection.
            </p>
            <div className="mt-6 flex items-center gap-8">
              <a href="mailto:mathias@stanford.edu"
                className="font-mono border border-[#f0ede6]/40 rounded-full hover:bg-[#f0ede6] hover:text-[#0d0d0d] hover:border-[#f0ede6] transition-all duration-300 text-[#f0ede6]"
                style={{ padding: "12px 28px", fontSize: "clamp(13px, 1.1vw, 16px)" }}>
                → say hi
              </a>
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#f0ede6]/20 uppercase">
                Stanford, CA
              </span>
            </div>
          </div>

        </div>


      </div>
    </div>
  );
}
