"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// ── UX Process steps ───────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    label: "DISCOVER",
    sub: "Research & Empathize",
    body: "Understand users deeply through interviews, observations, and contextual inquiry. Map pain points and uncover hidden needs.",
    color: "#E63329",
    hex: 0xE63329,
    tags: ["User Interviews", "Field Research", "Surveys", "Affinity Maps"],
  },
  {
    num: "02",
    label: "DEFINE",
    sub: "Synthesize & Frame",
    body: "Distill research into actionable insights. Create personas, journey maps, and a clear problem statement that guides the team.",
    color: "#F5C500",
    hex: 0xF5C500,
    tags: ["Personas", "Journey Maps", "HMW Statements", "POV"],
  },
  {
    num: "03",
    label: "IDEATE",
    sub: "Design & Explore",
    body: "Generate hundreds of ideas without judgment. Sketch rapidly, challenge assumptions, and identify the most promising directions.",
    color: "#1B3F8B",
    hex: 0x1B3F8B,
    tags: ["Sketching", "Crazy 8s", "Storyboards", "Mind Maps"],
  },
  {
    num: "04",
    label: "ITERATE",
    sub: "Prototype & Test",
    body: "Build lightweight prototypes and test with real users. Embrace failure as learning — each cycle sharpens the solution.",
    color: "#2A9D8F",
    hex: 0x2A9D8F,
    tags: ["Wireframes", "Figma Prototypes", "Usability Tests", "A/B Testing"],
  },
];

const PANEL_COUNT = STEPS.length + 1; // intro + 4 steps

// ── Per-step Three.js fluid canvas ────────────────────────────
function FluidCanvas({ color, active }: { color: number; active: boolean }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef(0);

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
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 6;

    // ── Ribbons / flowing lines ────────────────────────────────
    const ribbonCount = 18;
    const ribbons: { mesh: THREE.Line; phase: number; speed: number; amp: number } [] = [];

    for (let r = 0; r < ribbonCount; r++) {
      const points: THREE.Vector3[] = [];
      const segments = 80;
      for (let s = 0; s <= segments; s++) {
        points.push(new THREE.Vector3(
          (s / segments - 0.5) * 14,
          (r / ribbonCount - 0.5) * 8,
          0
        ));
      }
      const geo = new THREE.BufferGeometry().setFromPoints(points);
      const mat = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.12 + (r % 3) * 0.06,
      });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      ribbons.push({ mesh: line, phase: r * 0.38, speed: 0.3 + (r % 5) * 0.12, amp: 0.3 + (r % 4) * 0.15 });
    }

    // ── Floating particles ─────────────────────────────────────
    const N = 80;
    const pPos = new Float32Array(N * 3);
    const pVel: number[] = [];
    for (let i = 0; i < N; i++) {
      pPos[i*3]   = (Math.random()-0.5) * 14;
      pPos[i*3+1] = (Math.random()-0.5) * 9;
      pPos[i*3+2] = (Math.random()-0.5) * 3;
      pVel.push((Math.random()-0.5)*0.006, (Math.random()-0.5)*0.006, 0);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({ color, size: 0.07, transparent: true, opacity: 0.6 });
    scene.add(new THREE.Points(pGeo, pMat));

    // ── Central shape ──────────────────────────────────────────
    const cGeo = new THREE.IcosahedronGeometry(1.2, 2);
    const cMat = new THREE.MeshBasicMaterial({ color, wireframe: true, transparent: true, opacity: active ? 0.22 : 0.10 });
    const cMesh = new THREE.Mesh(cGeo, cMat);
    cMesh.position.set(3.5, 0.5, -1);
    scene.add(cMesh);

    // ── Animate ────────────────────────────────────────────────
    let t = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      t += 0.012;

      // Undulate ribbons (sine wave)
      ribbons.forEach(({ mesh, phase, speed, amp }) => {
        const posAttr = mesh.geometry.attributes.position;
        const arr = posAttr.array as Float32Array;
        for (let s = 0; s <= 80; s++) {
          arr[s * 3 + 1] = ((mesh.position.y || 0)) +
            amp * Math.sin(arr[s * 3] * 0.4 + t * speed + phase) +
            amp * 0.4 * Math.sin(arr[s * 3] * 0.8 + t * speed * 1.5 + phase * 2);
        }
        posAttr.needsUpdate = true;
      });

      // Move particles
      const pp = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < N; i++) {
        pp[i*3]   += pVel[i*3];
        pp[i*3+1] += pVel[i*3+1];
        if (Math.abs(pp[i*3])   > 7) pVel[i*3]   *= -1;
        if (Math.abs(pp[i*3+1]) > 4.5) pVel[i*3+1] *= -1;
      }
      pGeo.attributes.position.needsUpdate = true;

      cMesh.rotation.x = t * 0.18;
      cMesh.rotation.y = t * 0.25;

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [color, active]);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />;
}

// ── Intro Three.js — particle grid ────────────────────────────
function IntroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const rafRef   = useRef(0);

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
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 8;

    // Grid of points that wave
    const cols = 28, rows = 18;
    const pts: THREE.Vector3[] = [];
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++)
        pts.push(new THREE.Vector3((c / cols - 0.5) * 20, (r / rows - 0.5) * 13, 0));

    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.PointsMaterial({ color: 0xf0ede6, size: 0.05, transparent: true, opacity: 0.35 });
    const grid = new THREE.Points(geo, mat);
    scene.add(grid);

    let t = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      t += 0.009;
      const arr = geo.attributes.position.array as Float32Array;
      for (let i = 0; i < pts.length; i++) {
        const ox = pts[i].x, oy = pts[i].y;
        arr[i*3+2] = Math.sin(ox * 0.5 + t) * Math.cos(oy * 0.5 + t * 0.7) * 1.2;
      }
      geo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      camera.aspect = w / h; camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ position: "absolute", inset: 0 }} />;
}

// ── FifthScreen — scroll-hijack horizontal ────────────────────
export default function FifthScreen() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0); // 0→1 through all panels

  // Map scroll position to horizontal progress
  const onScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const total = el.offsetHeight - window.innerHeight;
    const scrolled = -rect.top;
    const p = Math.max(0, Math.min(1, scrolled / total));
    setProgress(p);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [onScroll]);

  // Which panel is "active" (0 = intro, 1-4 = steps)
  const panelProgress = progress * PANEL_COUNT;
  const activePanel   = Math.floor(panelProgress);
  // Sub-progress within current panel (0→1)
  const subProgress   = panelProgress - activePanel;

  // Translate: move content LEFT as user scrolls
  // Each panel is 100vw wide; at progress=1 we're at last panel
  const translateX = -progress * (PANEL_COUNT - 1) * 100; // vw

  return (
    // Tall container gives scroll space: one viewport per panel
    <div ref={containerRef} style={{ height: `${PANEL_COUNT * 100}vh`, position: "relative" }}>
      <style>{`
        .s5-tag {
          font-family: monospace;
          font-size: clamp(9px, 0.85vw, 11px);
          letter-spacing: 0.1em;
          color: rgba(240,237,230,0.5);
          border: 1px solid rgba(240,237,230,0.2);
          padding: 4px 10px;
          border-radius: 3px;
          white-space: nowrap;
        }
      `}</style>

      {/* Sticky viewport */}
      <div style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        overflow: "hidden",
        background: "#0a0a0a",
      }}>

        {/* Horizontal track */}
        <div style={{
          display: "flex",
          width: `${PANEL_COUNT * 100}vw`,
          height: "100%",
          transform: `translateX(${translateX}vw)`,
          transition: "transform 0.05s linear",
          willChange: "transform",
        }}>

          {/* ── Panel 0: Intro ──────────────────────────────── */}
          <div style={{
            width: "100vw", height: "100%", flexShrink: 0,
            position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <IntroCanvas />
            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <p style={{
                fontFamily: "monospace", fontSize: "clamp(10px, 1vw, 13px)",
                letterSpacing: "0.28em", color: "rgba(240,237,230,0.35)",
                textTransform: "uppercase", margin: "0 0 18px",
                opacity: activePanel === 0 ? 1 : 0,
                transform: activePanel === 0 ? "translateY(0)" : "translateY(-12px)",
                transition: "opacity 0.6s ease, transform 0.6s ease",
              }}>
                UX Research & Design
              </p>
              <h2 style={{
                fontFamily: "monospace", fontWeight: 900,
                fontSize: "clamp(36px, 7vw, 96px)",
                color: "#f0ede6", margin: 0,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}>
                THE<br />PROCESS
              </h2>
              <p style={{
                fontFamily: "monospace",
                fontSize: "clamp(10px, 1vw, 13px)",
                letterSpacing: "0.2em",
                color: "rgba(240,237,230,0.3)",
                margin: "28px 0 0",
                opacity: activePanel === 0 ? (subProgress > 0.3 ? 0.8 : subProgress / 0.3 * 0.8) : 0,
                transition: "opacity 0.4s ease",
              }}>
                SCROLL TO EXPLORE ↓
              </p>
            </div>

            {/* Step preview pills at bottom */}
            <div style={{
              position: "absolute", bottom: "8%", left: "50%",
              transform: "translateX(-50%)",
              display: "flex", gap: 12,
              opacity: subProgress > 0.4 ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}>
              {STEPS.map((s, i) => (
                <div key={i} style={{
                  fontFamily: "monospace", fontSize: 11,
                  color: s.color, letterSpacing: "0.1em",
                  borderBottom: `2px solid ${s.color}`,
                  paddingBottom: 3,
                }}>
                  {s.num} {s.label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Panels 1–4: Steps ───────────────────────────── */}
          {STEPS.map((step, i) => {
            const panelIdx = i + 1;
            const isActive = activePanel === panelIdx;
            const isPast   = activePanel > panelIdx;

            return (
              <div key={step.num} style={{
                width: "100vw", height: "100%", flexShrink: 0,
                position: "relative", display: "flex",
                alignItems: "center",
                padding: "0 clamp(32px, 7vw, 120px)",
              }}>
                {/* Fluid Three.js background */}
                <FluidCanvas color={step.hex} active={isActive} />

                {/* Thin colored left border */}
                <div style={{
                  position: "absolute", left: 0, top: "10%", bottom: "10%",
                  width: 3, background: step.color, borderRadius: 2,
                  opacity: isActive ? 1 : 0.3,
                  transition: "opacity 0.5s ease",
                }} />

                {/* Content */}
                <div style={{
                  position: "relative", zIndex: 1,
                  maxWidth: 720,
                  opacity: isActive ? 1 : isPast ? 0.4 : 0.15,
                  transform: isActive ? "translateX(0)" : isPast ? "translateX(-40px)" : "translateX(60px)",
                  transition: "opacity 0.55s cubic-bezier(0.22,1,0.36,1), transform 0.55s cubic-bezier(0.22,1,0.36,1)",
                }}>
                  {/* Step number */}
                  <p style={{
                    fontFamily: "monospace", fontWeight: 700,
                    fontSize: "clamp(11px, 1.2vw, 15px)",
                    color: step.color, letterSpacing: "0.22em",
                    margin: "0 0 12px",
                    textTransform: "uppercase",
                  }}>
                    Step {step.num} / {STEPS.length}
                  </p>

                  {/* Title */}
                  <h2 style={{
                    fontFamily: "monospace", fontWeight: 900,
                    fontSize: "clamp(42px, 8vw, 110px)",
                    color: "#f0ede6", margin: "0 0 8px",
                    lineHeight: 0.92, letterSpacing: "-0.02em",
                  }}>
                    {step.label}
                  </h2>

                  {/* Subtitle */}
                  <p style={{
                    fontFamily: "Georgia, serif", fontStyle: "italic",
                    fontSize: "clamp(15px, 1.8vw, 24px)",
                    color: step.color, margin: "0 0 24px",
                  }}>
                    {step.sub}
                  </p>

                  {/* Divider */}
                  <div style={{
                    width: isActive ? "clamp(40px, 6vw, 80px)" : 0,
                    height: 2, background: step.color, borderRadius: 1,
                    transition: "width 0.8s cubic-bezier(0.22,1,0.36,1) 0.2s",
                    marginBottom: 24,
                  }} />

                  {/* Body */}
                  <p style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "clamp(14px, 1.4vw, 19px)",
                    color: "rgba(240,237,230,0.72)",
                    lineHeight: 1.7, margin: "0 0 28px",
                    maxWidth: 520,
                  }}>
                    {step.body}
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {step.tags.map(tag => (
                      <span key={tag} className="s5-tag">{tag}</span>
                    ))}
                  </div>
                </div>

                {/* Progress indicator dots */}
                <div style={{
                  position: "absolute", right: "clamp(24px, 4vw, 60px)", top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex", flexDirection: "column", gap: 10,
                }}>
                  {STEPS.map((s, di) => (
                    <div key={di} style={{
                      width: 7, height: di === i ? 24 : 7,
                      borderRadius: 4,
                      background: di === i ? s.color : "rgba(255,255,255,0.2)",
                      transition: "all 0.4s ease",
                    }} />
                  ))}
                </div>

                {/* Panel counter bottom-left */}
                <div style={{
                  position: "absolute", bottom: "8%", left: "clamp(32px, 7vw, 120px)",
                  fontFamily: "monospace", fontSize: 11,
                  color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em",
                }}>
                  {step.num} — {step.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global scroll progress bar */}
        <div style={{
          position: "absolute", bottom: 0, left: 0,
          height: 2, background: "rgba(255,255,255,0.08)",
          width: "100%", zIndex: 10,
        }}>
          <div style={{
            height: "100%",
            background: STEPS[Math.max(0, activePanel - 1)]?.color ?? "#f0ede6",
            width: `${progress * 100}%`,
            transition: "width 0.1s linear, background 0.4s ease",
          }} />
        </div>
      </div>
    </div>
  );
}
