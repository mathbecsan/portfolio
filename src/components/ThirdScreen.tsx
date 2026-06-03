"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── Brain regions ─────────────────────────────────────────────
const REGIONS = [
  { id: "hci",         label: "HCI",               color: 0x2952A3, position: new THREE.Vector3(-1.1,  0.6,  0.8), size: 0.72 },
  { id: "hai",         label: "HAI",               color: 0xE63329, position: new THREE.Vector3( 1.1,  0.5,  0.7), size: 0.68 },
  { id: "neuro",       label: "Neuroscience",       color: 0xF5A623, position: new THREE.Vector3( 0,    0.9, -0.5), size: 0.62 },
  { id: "psych",       label: "Psychology",         color: 0x2A9D8F, position: new THREE.Vector3(-0.9, -0.3,  0.4), size: 0.58 },
  { id: "linguistics", label: "Linguistics",        color: 0xE9C46A, position: new THREE.Vector3( 0.9, -0.4,  0.5), size: 0.55 },
  { id: "philosophy",  label: "Philosophy",         color: 0x6A4C93, position: new THREE.Vector3( 0,   -0.7, -0.3), size: 0.52 },
  { id: "design",      label: "Design",             color: 0xE76F51, position: new THREE.Vector3(-0.5,  0.2,  1.1), size: 0.50 },
  { id: "cogsci",      label: "Cognition Research", color: 0x264653, position: new THREE.Vector3( 0.5,  0.1,  1.0), size: 0.48 },
];

// ── Interactive Three.js brain ─────────────────────────────────
function BrainCanvas({ onHover }: { onHover: (label: string | null) => void }) {
  const mountRef    = useRef<HTMLDivElement>(null);
  const sceneRef    = useRef<THREE.Scene | null>(null);
  const cameraRef   = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const meshesRef   = useRef<THREE.Mesh[]>([]);
  const isDragging  = useRef(false);
  const lastMouse   = useRef({ x: 0, y: 0 });
  const rotGroup    = useRef<THREE.Group | null>(null);
  const rafRef      = useRef<number>(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const W = mount.clientWidth, H = mount.clientHeight;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
    camera.position.set(0, 0.5, 7);
    cameraRef.current = camera;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const dir = new THREE.DirectionalLight(0xffffff, 1.2);
    dir.position.set(3, 5, 5);
    dir.castShadow = true;
    scene.add(dir);
    const fill = new THREE.DirectionalLight(0xF5A623, 0.3);
    fill.position.set(-4, -2, -3);
    scene.add(fill);

    // Group for rotation
    const group = new THREE.Group();
    rotGroup.current = group;
    scene.add(group);

    // ── Build brain ──
    // Core cerebrum (large base sphere, slightly flattened)
    const coreGeo = new THREE.SphereGeometry(1.5, 64, 64);
    coreGeo.scale(1, 0.88, 0.92);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0xf0d9a8,
      shininess: 30,
      transparent: true,
      opacity: 0.25,
      side: THREE.FrontSide,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    // Inter-hemisphere groove
    const grooveGeo = new THREE.TorusGeometry(1.46, 0.05, 8, 64, Math.PI);
    const grooveMat = new THREE.MeshPhongMaterial({ color: 0x8b6914, transparent: true, opacity: 0.4 });
    const groove = new THREE.Mesh(grooveGeo, grooveMat);
    groove.rotation.y = Math.PI / 2;
    groove.rotation.x = -Math.PI / 8;
    group.add(groove);

    // Brain stem
    const stemGeo = new THREE.CylinderGeometry(0.18, 0.24, 0.9, 16);
    const stemMat = new THREE.MeshPhongMaterial({ color: 0xc8a96e, shininess: 20 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, -1.7, 0);
    group.add(stem);

    // Pedestal
    const pedGeo = new THREE.CylinderGeometry(0.55, 0.7, 0.25, 32);
    const pedMat = new THREE.MeshPhongMaterial({ color: 0xd4b896, shininess: 40 });
    const ped = new THREE.Mesh(pedGeo, pedMat);
    ped.position.set(0, -2.22, 0);
    group.add(ped);

    // Cerebellum
    const cbGeo = new THREE.SphereGeometry(0.58, 32, 32);
    cbGeo.scale(1.3, 0.75, 1.0);
    const cbMat = new THREE.MeshPhongMaterial({ color: 0xd4b896, shininess: 25 });
    const cb = new THREE.Mesh(cbGeo, cbMat);
    cb.position.set(0, -1.15, -0.85);
    group.add(cb);

    // Cortex fold lines (wireframe overlay)
    const foldGeo = new THREE.SphereGeometry(1.52, 12, 12);
    foldGeo.scale(1, 0.88, 0.92);
    const foldMat = new THREE.MeshBasicMaterial({ color: 0x8b6914, wireframe: true, transparent: true, opacity: 0.08 });
    group.add(new THREE.Mesh(foldGeo, foldMat));

    // Region blobs
    const meshes: THREE.Mesh[] = [];
    REGIONS.forEach(r => {
      const geo = new THREE.SphereGeometry(r.size, 32, 32);
      const mat = new THREE.MeshPhongMaterial({
        color: r.color,
        shininess: 60,
        transparent: true,
        opacity: 0.82,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(r.position);
      mesh.userData = { regionId: r.id, label: r.label, baseOpacity: 0.82, color: r.color };
      group.add(mesh);
      meshes.push(mesh);
    });
    meshesRef.current = meshes;

    // Raycaster for hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let hoveredMesh: THREE.Mesh | null = null;

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / W) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / H) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(meshes);
      if (hits.length > 0) {
        const hit = hits[0].object as THREE.Mesh;
        if (hit !== hoveredMesh) {
          if (hoveredMesh) (hoveredMesh.material as THREE.MeshPhongMaterial).opacity = hoveredMesh.userData.baseOpacity;
          hoveredMesh = hit;
          (hit.material as THREE.MeshPhongMaterial).opacity = 1;
          onHover(hit.userData.label);
          mount.style.cursor = "pointer";
        }
      } else {
        if (hoveredMesh) {
          (hoveredMesh.material as THREE.MeshPhongMaterial).opacity = hoveredMesh.userData.baseOpacity;
          hoveredMesh = null;
          onHover(null);
          mount.style.cursor = "grab";
        }
      }

      // Drag rotation
      if (isDragging.current) {
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        group.rotation.y += dx * 0.012;
        group.rotation.x += dy * 0.008;
        group.rotation.x = Math.max(-0.6, Math.min(0.6, group.rotation.x));
        lastMouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    const onMouseDown = (e: MouseEvent) => { isDragging.current = true; lastMouse.current = { x: e.clientX, y: e.clientY }; mount.style.cursor = "grabbing"; };
    const onMouseUp   = () => { isDragging.current = false; mount.style.cursor = "grab"; };

    // Touch support
    const onTouchStart = (e: TouchEvent) => { isDragging.current = true; lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onTouchMove  = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - lastMouse.current.x;
      const dy = e.touches[0].clientY - lastMouse.current.y;
      group.rotation.y += dx * 0.012;
      group.rotation.x += dy * 0.008;
      group.rotation.x = Math.max(-0.6, Math.min(0.6, group.rotation.x));
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchEnd = () => { isDragging.current = false; };

    mount.addEventListener("mousemove",  onMouseMove);
    mount.addEventListener("mousedown",  onMouseDown);
    mount.addEventListener("mouseup",    onMouseUp);
    mount.addEventListener("mouseleave", onMouseUp);
    mount.addEventListener("touchstart", onTouchStart, { passive: true });
    mount.addEventListener("touchmove",  onTouchMove,  { passive: true });
    mount.addEventListener("touchend",   onTouchEnd);

    mount.style.cursor = "grab";

    // Animate
    let t = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      t += 0.008;
      if (!isDragging.current) group.rotation.y += 0.003;
      // Subtle pulse on region blobs
      meshes.forEach((m, i) => {
        const mat = m.material as THREE.MeshPhongMaterial;
        if (mat.opacity < 0.99) {
          m.scale.setScalar(1 + 0.03 * Math.sin(t + i * 0.8));
        }
      });
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
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove",  onMouseMove);
      mount.removeEventListener("mousedown",  onMouseDown);
      mount.removeEventListener("mouseup",    onMouseUp);
      mount.removeEventListener("mouseleave", onMouseUp);
      mount.removeEventListener("touchstart", onTouchStart);
      mount.removeEventListener("touchmove",  onTouchMove);
      mount.removeEventListener("touchend",   onTouchEnd);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [onHover]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

// ── Key Principle card ─────────────────────────────────────────
function PrincipleCard({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 12,
      padding: "14px 18px",
      display: "flex",
      alignItems: "center",
      gap: 14,
      boxShadow: "0 2px 8px rgba(0,0,0,0.07)",
    }}>
      <span style={{ fontSize: "1.5rem" }}>{icon}</span>
      <span style={{ fontFamily: "Georgia, serif", fontSize: "clamp(12px, 1.1vw, 15px)", color: "#1a1a1a", lineHeight: 1.35 }}>{text}</span>
    </div>
  );
}

// ── ThirdScreen ────────────────────────────────────────────────
export default function ThirdScreen() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section style={{
      position: "relative",
      background: "#F5E6C0",
      overflow: "hidden",
      minHeight: "100vh",
      display: "flex",
      alignItems: "stretch",
    }}>
      {/* Corner decorations */}
      <img src="/second-screen/word-1.svg" aria-hidden alt=""
        style={{ position: "absolute", top: 0, left: 0, width: "clamp(60px, 9vw, 140px)", zIndex: 0 }} />
      <img src="/second-screen/word-4.svg" aria-hidden alt=""
        style={{ position: "absolute", top: 0, right: 0, height: "clamp(60px, 9vw, 130px)", width: "auto", zIndex: 0 }} />
      <img src="/second-screen/word-2.svg" aria-hidden alt=""
        style={{ position: "absolute", bottom: 0, left: 0, width: "clamp(100px, 16vw, 240px)", zIndex: 0 }} />
      <img src="/second-screen/word-3.svg" aria-hidden alt=""
        style={{ position: "absolute", bottom: 0, right: 0, width: "clamp(100px, 16vw, 240px)", zIndex: 0 }} />

      {/* Dot accent (top-left, like reference) */}
      <div style={{ position: "absolute", top: "clamp(14px,2vw,28px)", left: "clamp(14px,2vw,28px)", display: "flex", gap: 8, zIndex: 2 }}>
        {["#1a1a1a","#E63329","#F5A623","#2952A3"].map(c => (
          <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
        ))}
      </div>

      {/* Main two-column layout */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex",
        flexWrap: "wrap",
        width: "100%",
        padding: "clamp(56px, 7vw, 96px) clamp(32px, 5vw, 72px) clamp(80px, 8vw, 120px)",
        gap: "clamp(24px, 4vw, 56px)",
        alignItems: "center",
      }}>

        {/* ── LEFT: Interactive Brain ── */}
        <div style={{ flex: "1 1 340px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>

          {/* Brain canvas */}
          <div style={{
            width: "100%",
            maxWidth: 460,
            aspectRatio: "1 / 1.05",
            position: "relative",
          }}>
            <BrainCanvas onHover={setHovered} />

            {/* Hover tooltip */}
            {hovered && (
              <div style={{
                position: "absolute", top: 12, left: "50%",
                transform: "translateX(-50%)",
                background: "#1a1a1a",
                color: "#F5E6C0",
                fontFamily: "monospace",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.08em",
                padding: "6px 16px",
                borderRadius: 4,
                pointerEvents: "none",
                whiteSpace: "nowrap",
                boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
              }}>
                {hovered}
              </div>
            )}
          </div>

          {/* Region legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px 12px", justifyContent: "center", maxWidth: 400 }}>
            {REGIONS.map(r => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: `#${r.color.toString(16).padStart(6,"0")}`, flexShrink: 0 }} />
                <span style={{ fontFamily: "monospace", fontSize: 11, color: "#4a3a1a", letterSpacing: "0.04em" }}>{r.label}</span>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: "monospace", fontSize: 11, color: "#8b6914", textAlign: "center", letterSpacing: "0.06em", margin: 0 }}>
            DRAG TO ROTATE · HOVER TO EXPLORE
          </p>
        </div>

        {/* ── RIGHT: Academic info ── */}
        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", gap: "clamp(12px, 1.8vw, 22px)" }}>

          {/* Label */}
          <p style={{ fontFamily: "monospace", fontSize: "clamp(10px, 1vw, 13px)", letterSpacing: "0.18em", color: "#6B1A1A", textTransform: "uppercase", margin: 0 }}>
            I am a rising senior majoring in
          </p>

          {/* Major */}
          <h2 style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 4vw, 58px)",
            lineHeight: 1.05,
            color: "#1a1a1a",
            margin: 0,
          }}>
            Symbolic Systems
          </h2>

          {/* Concentration */}
          <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(13px, 1.4vw, 18px)", color: "#4a3a1a", margin: 0 }}>
            (HCI&nbsp;🤝 / HAI&nbsp;🧠 Concentration)
          </p>

          {/* Stanford */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1.5px solid rgba(107,26,26,0.2)", paddingTop: "clamp(8px, 1vw, 14px)" }}>
            <span style={{
              fontFamily: "monospace", fontWeight: 900,
              fontSize: "clamp(13px, 1.5vw, 18px)",
              letterSpacing: "0.12em",
              color: "#8C1515",
              textTransform: "uppercase",
            }}>
              AT STANFORD UNIVERSITY
            </span>
            <span style={{ fontSize: "1.4rem" }}>🌲</span>
          </div>

          {/* Bio */}
          <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(13px, 1.2vw, 16px)", color: "#4a3a1a", lineHeight: 1.6, margin: 0 }}>
            AI enthusiast. Builder. Learner.<br />Always seeking impact.
          </p>

          {/* Key Principles */}
          <div>
            <p style={{
              fontFamily: "monospace", fontWeight: 900,
              fontSize: "clamp(14px, 1.6vw, 20px)",
              letterSpacing: "0.14em",
              color: "#6B1A1A",
              textTransform: "uppercase",
              margin: "0 0 4px",
            }}>
              Key Principles
            </p>
            <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.1em", color: "#8b6914", margin: "0 0 12px", textTransform: "uppercase" }}>
              I follow and believe in
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <PrincipleCard icon="🤝" text="People are the biggest value" />
              <PrincipleCard icon="🔄" text="Flexibility is a superpower" />
              <PrincipleCard icon="🎯" text="Do your best or don't start" />
              <PrincipleCard icon="💬" text="Good communication leads to success" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
