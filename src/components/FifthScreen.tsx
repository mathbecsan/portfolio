"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── Design Process steps ───────────────────────────────────────
const STEPS = [
  {
    num: "01", label: "RESEARCH",    sub: "Understand context & constraints",
    color: 0xE63329, accent: "#E63329",
    geo: () => new THREE.SphereGeometry(0.9, 32, 32),
  },
  {
    num: "02", label: "STRUCTURE",  sub: "Define grid & hierarchy",
    color: 0xF5C500, accent: "#F5C500",
    geo: () => new THREE.BoxGeometry(1.5, 1.5, 1.5),
  },
  {
    num: "03", label: "ITERATE",    sub: "Refine through reduction",
    color: 0x1B3F8B, accent: "#1B3F8B",
    geo: () => new THREE.TorusGeometry(0.8, 0.3, 16, 48),
  },
  {
    num: "04", label: "DELIVER",    sub: "Ship with intention",
    color: 0x2A9D8F, accent: "#2A9D8F",
    geo: () => new THREE.ConeGeometry(0.85, 1.7, 32),
  },
];

// ── Per-step Three.js card ─────────────────────────────────────
function StepCanvas({ step, active }: { step: typeof STEPS[0]; active: boolean }) {
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
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 50);
    camera.position.set(0, 0, 4.5);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 4, 5); scene.add(key);
    const rim = new THREE.DirectionalLight(step.color, 0.8);
    rim.position.set(-3, -1, -2); scene.add(rim);

    // Main shape
    const geo  = step.geo();
    const mat  = new THREE.MeshPhongMaterial({
      color: step.color, shininess: 70,
      transparent: true, opacity: 0.88,
    });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    // Wireframe overlay
    const wMat  = new THREE.MeshBasicMaterial({ color: step.color, wireframe: true, transparent: true, opacity: 0.18 });
    const wMesh = new THREE.Mesh(geo.clone(), wMat);
    wMesh.scale.setScalar(1.06);
    scene.add(wMesh);

    // Orbiting particles
    const particleGeo = new THREE.BufferGeometry();
    const count = 60;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(2 * Math.random() - 1);
      const r     = 1.6 + Math.random() * 0.8;
      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({ color: step.color, size: 0.06, transparent: true, opacity: 0.7 });
    scene.add(new THREE.Points(particleGeo, pMat));

    // ── Animate ────────────────────────────────────────────────
    let t = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      t += active ? 0.012 : 0.004;
      mesh.rotation.y   = t;
      mesh.rotation.x   = Math.sin(t * 0.4) * 0.3;
      wMesh.rotation.y  = t * 1.02;
      wMesh.rotation.x  = mesh.rotation.x;
      // Breathe
      const s = 1 + (active ? 0.06 : 0.02) * Math.sin(t * 1.5);
      mesh.scale.setScalar(s);
      wMesh.scale.setScalar(s * 1.06);
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
  }, [step, active]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

// ── FifthScreen ────────────────────────────────────────────────
export default function FifthScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Auto-cycle through steps
  useEffect(() => {
    if (!visible) return;
    const t = setInterval(() => setActiveStep(p => (p + 1) % STEPS.length), 3200);
    return () => clearInterval(t);
  }, [visible]);

  return (
    <section ref={sectionRef} style={{
      background: "#0d0d0d",
      padding: "clamp(60px, 8vw, 100px) clamp(24px, 5vw, 72px)",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes processIn {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes lineGrow {
          from { width: 0; }
          to   { width: 100%; }
        }
      `}</style>

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        marginBottom: "clamp(32px, 5vw, 64px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease, transform 0.7s ease",
      }}>
        {/* Bauhaus accent bars */}
        <div style={{ display: "flex", gap: 4 }}>
          {["#E63329","#F5C500","#1B3F8B"].map(c => (
            <div key={c} style={{ width: 5, height: 32, background: c, borderRadius: 2 }} />
          ))}
        </div>
        <h2 style={{
          fontFamily: "monospace", fontWeight: 900,
          fontSize: "clamp(22px, 3.5vw, 48px)",
          color: "#f0ede6", margin: 0, letterSpacing: "0.06em", textTransform: "uppercase",
        }}>
          Design Process
        </h2>
      </div>

      {/* Steps grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "clamp(16px, 2.5vw, 32px)",
      }}>
        {STEPS.map((step, i) => {
          const isActive = activeStep === i;
          return (
            <div key={step.num}
              onClick={() => setActiveStep(i)}
              style={{
                cursor: "pointer",
                background: isActive ? "#1a1a1a" : "#141414",
                border: `1.5px solid ${isActive ? step.accent : "rgba(255,255,255,0.07)"}`,
                borderRadius: 12,
                overflow: "hidden",
                boxShadow: isActive ? `0 0 32px ${step.accent}33` : "none",
                transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
                transform: isActive ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
                opacity: visible ? 1 : 0,
                animation: visible ? `processIn 0.6s ease ${i * 0.12}s both` : "none",
              }}
            >
              {/* Three.js canvas */}
              <div style={{ width: "100%", aspectRatio: "1/0.8", position: "relative" }}>
                <StepCanvas step={step} active={isActive} />
                {/* Step number overlay */}
                <div style={{
                  position: "absolute", top: 12, left: 14,
                  fontFamily: "monospace", fontSize: "clamp(10px, 1.1vw, 13px)",
                  color: step.accent, fontWeight: 700, letterSpacing: "0.1em",
                  background: "rgba(0,0,0,0.5)", padding: "3px 8px", borderRadius: 4,
                }}>
                  {step.num}
                </div>
              </div>

              {/* Label */}
              <div style={{ padding: "clamp(14px, 2vw, 22px)" }}>
                {/* Progress bar */}
                <div style={{ height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 1, marginBottom: 12, overflow: "hidden" }}>
                  <div style={{
                    height: "100%", background: step.accent, borderRadius: 1,
                    width: isActive ? "100%" : "0%",
                    transition: isActive ? "width 3.2s linear" : "width 0.3s ease",
                  }} />
                </div>
                <h3 style={{
                  fontFamily: "monospace", fontWeight: 900,
                  fontSize: "clamp(13px, 1.6vw, 20px)",
                  color: isActive ? step.accent : "#f0ede6",
                  margin: "0 0 6px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  transition: "color 0.3s ease",
                }}>
                  {step.label}
                </h3>
                <p style={{
                  fontFamily: "monospace",
                  fontSize: "clamp(10px, 0.95vw, 13px)",
                  color: "rgba(240,237,230,0.45)",
                  margin: 0, lineHeight: 1.55,
                  transition: "color 0.3s ease",
                }}>
                  {step.sub}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step indicator dots */}
      <div style={{
        display: "flex", justifyContent: "center", gap: 10,
        marginTop: "clamp(24px, 4vw, 48px)",
        opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.5s",
      }}>
        {STEPS.map((step, i) => (
          <button key={i} onClick={() => setActiveStep(i)}
            style={{
              width: activeStep === i ? 28 : 8,
              height: 8, borderRadius: 4, border: "none",
              background: activeStep === i ? step.accent : "rgba(255,255,255,0.2)",
              cursor: "pointer", padding: 0,
              transition: "all 0.4s cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        ))}
      </div>
    </section>
  );
}
