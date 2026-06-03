"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ── Brain lobe definitions ─────────────────────────────────────
const LOBES = [
  {
    id: "hci", label: "HCI", color: 0x2952A3,
    // Frontal lobe — front-top
    parts: [
      { p: [-0.35, 0.55, 0.75], s: [0.62, 0.55, 0.58] },
      { p: [ 0.35, 0.55, 0.75], s: [0.62, 0.55, 0.58] },
      { p: [ 0.00, 0.70, 0.55], s: [0.48, 0.42, 0.44] },
    ],
  },
  {
    id: "hai", label: "HAI", color: 0xE63329,
    // Parietal lobe — top-center
    parts: [
      { p: [-0.38, 0.85, 0.05], s: [0.55, 0.50, 0.52] },
      { p: [ 0.38, 0.85, 0.05], s: [0.55, 0.50, 0.52] },
      { p: [ 0.00, 0.92,-0.15], s: [0.42, 0.40, 0.44] },
    ],
  },
  {
    id: "neuro", label: "Neuroscience", color: 0xF5A623,
    // Occipital lobe — back
    parts: [
      { p: [-0.28, 0.45,-0.82], s: [0.52, 0.48, 0.46] },
      { p: [ 0.28, 0.45,-0.82], s: [0.52, 0.48, 0.46] },
    ],
  },
  {
    id: "linguistics", label: "Linguistics", color: 0xE9C46A,
    // Temporal lobe — lower sides
    parts: [
      { p: [-0.92, 0.05, 0.20], s: [0.52, 0.44, 0.56] },
      { p: [ 0.92, 0.05, 0.20], s: [0.52, 0.44, 0.56] },
      { p: [-0.82,-0.12,-0.15], s: [0.40, 0.38, 0.40] },
      { p: [ 0.82,-0.12,-0.15], s: [0.40, 0.38, 0.40] },
    ],
  },
  {
    id: "psych", label: "Psychology", color: 0x2A9D8F,
    // Insular / limbic — inner lateral
    parts: [
      { p: [-0.70, 0.28, 0.38], s: [0.44, 0.40, 0.42] },
      { p: [ 0.70, 0.28, 0.38], s: [0.44, 0.40, 0.42] },
    ],
  },
  {
    id: "philosophy", label: "Philosophy", color: 0x6A4C93,
    // Frontal pole / prefrontal
    parts: [
      { p: [-0.18, 0.28, 0.98], s: [0.38, 0.34, 0.36] },
      { p: [ 0.18, 0.28, 0.98], s: [0.38, 0.34, 0.36] },
    ],
  },
  {
    id: "design", label: "Design", color: 0xE76F51,
    // Supplementary motor / premotor
    parts: [
      { p: [-0.22, 0.62, 0.40], s: [0.35, 0.32, 0.34] },
      { p: [ 0.22, 0.62, 0.40], s: [0.35, 0.32, 0.34] },
    ],
  },
  {
    id: "cogsci", label: "Cognition Research", color: 0x264653,
    // Cerebellum
    parts: [
      { p: [ 0.00,-1.05,-0.55], s: [0.72, 0.48, 0.62] },
      { p: [-0.38,-1.00,-0.40], s: [0.35, 0.30, 0.38] },
      { p: [ 0.38,-1.00,-0.40], s: [0.35, 0.30, 0.38] },
    ],
  },
];

// ── Gyri bump config ───────────────────────────────────────────
const GYRI_SEED = [
  // left hemisphere bumps
  ...Array.from({length: 28}, (_, i) => {
    const theta = (i / 28) * Math.PI * 2;
    const phi   = (i % 7) * (Math.PI / 8) + 0.3;
    const r = 0.95 + Math.sin(i * 7.3) * 0.08;
    return {
      x: -r * Math.sin(phi) * Math.cos(theta) * 0.65,
      y:  r * Math.cos(phi) * 0.82,
      z:  r * Math.sin(phi) * Math.sin(theta) * 0.88,
      s:  0.10 + Math.abs(Math.sin(i * 3.7)) * 0.09,
    };
  }),
  // right hemisphere bumps (mirror)
  ...Array.from({length: 28}, (_, i) => {
    const theta = (i / 28) * Math.PI * 2;
    const phi   = (i % 7) * (Math.PI / 8) + 0.3;
    const r = 0.95 + Math.sin(i * 7.3) * 0.08;
    return {
      x:  r * Math.sin(phi) * Math.cos(theta) * 0.65,
      y:  r * Math.cos(phi) * 0.82,
      z:  r * Math.sin(phi) * Math.sin(theta) * 0.88,
      s:  0.10 + Math.abs(Math.sin(i * 3.7)) * 0.09,
    };
  }),
];

function BrainCanvas({ onHover }: { onHover: (label: string | null) => void }) {
  const mountRef   = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMouse  = useRef({ x: 0, y: 0 });
  const rotGroup   = useRef<THREE.Group | null>(null);
  const lobeMeshes = useRef<THREE.Mesh[]>([]);
  const rafRef     = useRef(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;

    // ── Renderer ───────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 0.4, 6.2);

    // ── Lighting ───────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xfff5e0, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(3, 6, 5); key.castShadow = true; scene.add(key);
    const rim = new THREE.DirectionalLight(0xF5A623, 0.45);
    rim.position.set(-4, 1, -3); scene.add(rim);
    const fill = new THREE.DirectionalLight(0xaac8ff, 0.3);
    fill.position.set(0, -3, 4); scene.add(fill);
    const inner = new THREE.PointLight(0xffccaa, 0.4, 5);
    inner.position.set(0, 0, 0); scene.add(inner);

    // ── Brain group ─────────────────────────────────────────────
    const group = new THREE.Group();
    rotGroup.current = group;
    scene.add(group);

    // Base cerebrum core (nearly transparent, just for occlusion)
    const coreGeo = new THREE.SphereGeometry(1.06, 64, 64);
    coreGeo.scale(1, 0.86, 0.90);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0xf2cfa8, shininess: 12,
      transparent: true, opacity: 0.18,
    });
    group.add(new THREE.Mesh(coreGeo, coreMat));

    // Hemisphere base L+R
    const hemiColors = [0xf0c9a0, 0xedc49e];
    [-0.12, 0.12].forEach((xOff, hi) => {
      const hGeo = new THREE.SphereGeometry(0.98, 64, 48);
      hGeo.scale(0.98, 0.84, 0.88);
      const hMat = new THREE.MeshPhongMaterial({
        color: hemiColors[hi], shininess: 18,
        transparent: true, opacity: 0.72,
      });
      const hMesh = new THREE.Mesh(hGeo, hMat);
      hMesh.position.set(xOff, 0, 0);
      group.add(hMesh);
    });

    // Inter-hemisphere groove line
    const grooveGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.9, 8);
    const grooveMat = new THREE.MeshBasicMaterial({ color: 0x8b5e3c });
    const groove = new THREE.Mesh(grooveGeo, grooveMat);
    groove.position.set(0, 0.05, 0);
    group.add(groove);

    // ── Gyri bumps (surface folds) ─────────────────────────────
    GYRI_SEED.forEach(g => {
      const bGeo = new THREE.SphereGeometry(g.s, 10, 8);
      const bMat = new THREE.MeshPhongMaterial({
        color: 0xe8b88a, shininess: 8,
        transparent: true, opacity: 0.85,
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(g.x, g.y, g.z);
      group.add(bMesh);
    });

    // ── Lobe blobs ─────────────────────────────────────────────
    const allLobeMeshes: THREE.Mesh[] = [];
    LOBES.forEach(lobe => {
      lobe.parts.forEach(part => {
        const geo = new THREE.SphereGeometry(0.5, 32, 24);
        geo.scale(...(part.s as [number, number, number]));
        const mat = new THREE.MeshPhongMaterial({
          color: lobe.color, shininess: 55,
          transparent: true, opacity: 0.76,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(...(part.p as [number, number, number]));
        mesh.userData = { label: lobe.label, color: lobe.color, baseOpacity: 0.76 };
        group.add(mesh);
        allLobeMeshes.push(mesh);
      });
    });
    lobeMeshes.current = allLobeMeshes;

    // Thin sulcus lines (wire overlay)
    const wireGeo = new THREE.SphereGeometry(1.07, 18, 14);
    wireGeo.scale(1, 0.86, 0.90);
    const wireMat = new THREE.MeshBasicMaterial({
      color: 0x7a4a2a, wireframe: true, transparent: true, opacity: 0.05,
    });
    group.add(new THREE.Mesh(wireGeo, wireMat));

    // Brain stem
    const stemGeo = new THREE.CylinderGeometry(0.14, 0.20, 0.85, 16);
    const stemMat = new THREE.MeshPhongMaterial({ color: 0xd4956a, shininess: 20 });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.set(0, -1.52, 0.05);
    group.add(stem);

    // Pedestal base
    const pedGeo  = new THREE.CylinderGeometry(0.5, 0.65, 0.22, 32);
    const pedMat  = new THREE.MeshPhongMaterial({ color: 0xc8a078, shininess: 40 });
    const ped     = new THREE.Mesh(pedGeo, pedMat);
    ped.position.set(0, -2.02, 0);
    group.add(ped);

    // ── Raycaster ──────────────────────────────────────────────
    const raycaster = new THREE.Raycaster();
    const mouse     = new THREE.Vector2();
    let hoveredMesh: THREE.Mesh | null = null;

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(lobeMeshes.current);
      if (hits.length > 0) {
        const hit = hits[0].object as THREE.Mesh;
        if (hit !== hoveredMesh) {
          if (hoveredMesh) (hoveredMesh.material as THREE.MeshPhongMaterial).opacity = hoveredMesh.userData.baseOpacity;
          hoveredMesh = hit;
          (hit.material as THREE.MeshPhongMaterial).opacity = 1;
          (hit.material as THREE.MeshPhongMaterial).emissive.setHex(hit.userData.color);
          (hit.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.22;
          onHover(hit.userData.label);
          mount.style.cursor = "pointer";
        }
      } else {
        if (hoveredMesh) {
          (hoveredMesh.material as THREE.MeshPhongMaterial).opacity = hoveredMesh.userData.baseOpacity;
          (hoveredMesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 0;
          hoveredMesh = null;
          onHover(null);
          mount.style.cursor = "grab";
        }
      }
      if (isDragging.current) {
        const dx = e.clientX - lastMouse.current.x;
        const dy = e.clientY - lastMouse.current.y;
        group.rotation.y += dx * 0.012;
        group.rotation.x = Math.max(-0.55, Math.min(0.55, group.rotation.x + dy * 0.008));
        lastMouse.current = { x: e.clientX, y: e.clientY };
      }
    };

    const down = (e: MouseEvent) => { isDragging.current = true; lastMouse.current = { x: e.clientX, y: e.clientY }; mount.style.cursor = "grabbing"; };
    const up   = () => { isDragging.current = false; mount.style.cursor = "grab"; };

    const touchStart = (e: TouchEvent) => { isDragging.current = true; lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const touchMove  = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - lastMouse.current.x;
      const dy = e.touches[0].clientY - lastMouse.current.y;
      group.rotation.y += dx * 0.012;
      group.rotation.x = Math.max(-0.55, Math.min(0.55, group.rotation.x + dy * 0.008));
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    mount.addEventListener("mousemove",  onMouseMove);
    mount.addEventListener("mousedown",  down);
    mount.addEventListener("mouseup",    up);
    mount.addEventListener("mouseleave", up);
    mount.addEventListener("touchstart", touchStart, { passive: true });
    mount.addEventListener("touchmove",  touchMove,  { passive: true });
    mount.addEventListener("touchend",   up);
    mount.style.cursor = "grab";

    // ── Animate ────────────────────────────────────────────────
    let t = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      t += 0.006;
      if (!isDragging.current) group.rotation.y += 0.0025;
      // Subtle breathe on lobes
      allLobeMeshes.forEach((m, i) => {
        if ((m.material as THREE.MeshPhongMaterial).emissiveIntensity < 0.1) {
          m.scale.setScalar(1 + 0.025 * Math.sin(t + i * 0.6));
        }
      });
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
      ["mousemove","mousedown","mouseup","mouseleave"].forEach(ev => mount.removeEventListener(ev, onMouseMove));
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [onHover]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

// ── Principle card ─────────────────────────────────────────────
function PCard({ icon, text }: { icon: string; text: string }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.85)", borderRadius: 10,
      padding: "12px 16px", display: "flex", alignItems: "center", gap: 12,
      boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    }}>
      <span style={{ fontSize: "1.3rem" }}>{icon}</span>
      <span style={{ fontFamily: "Georgia, serif", fontSize: "clamp(11px, 1vw, 14px)", color: "#1a1a1a", lineHeight: 1.35 }}>{text}</span>
    </div>
  );
}

// ── ThirdScreen ────────────────────────────────────────────────
export default function ThirdScreen() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section style={{ position: "relative", background: "#F2EFE4", overflow: "hidden", minHeight: "100vh" }}>

      {/* Bauhaus corner bars (top-left accent matching reference) */}
      <div style={{ position: "absolute", top: "clamp(14px,2vw,28px)", left: "clamp(14px,2vw,28px)", display: "flex", gap: 4, zIndex: 2 }}>
        {[["#E63329",4,28],["#F5C500",4,28],["#1B3F8B",4,28]].map(([c,w,h],i) => (
          <div key={i} style={{ width: w as number, height: h as number, background: c as string, borderRadius: 1 }} />
        ))}
      </div>

      {/* Corner clusters */}
      <img src="/second-screen/word-1.svg" aria-hidden alt="" style={{ position:"absolute", top:0, left:0, width:"clamp(60px,9vw,130px)", zIndex:0 }} />
      <img src="/second-screen/word-4.svg" aria-hidden alt="" style={{ position:"absolute", top:0, right:0, height:"clamp(60px,9vw,120px)", width:"auto", zIndex:0 }} />
      <img src="/second-screen/word-2.svg" aria-hidden alt="" style={{ position:"absolute", bottom:0, left:0, width:"clamp(90px,14vw,200px)", zIndex:0 }} />
      <img src="/second-screen/word-3.svg" aria-hidden alt="" style={{ position:"absolute", bottom:0, right:0, width:"clamp(90px,14vw,200px)", zIndex:0 }} />

      {/* Two-column layout */}
      <div style={{
        position: "relative", zIndex: 1,
        display: "flex", flexWrap: "wrap", alignItems: "center",
        padding: "clamp(56px,7vw,96px) clamp(28px,5vw,68px) clamp(80px,8vw,110px)",
        gap: "clamp(20px,3vw,48px)",
        minHeight: "100vh",
      }}>

        {/* ── LEFT: Brain ── */}
        <div style={{ flex: "1 1 320px", display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
          <div style={{ width: "100%", maxWidth: 420, aspectRatio: "1/1.02", position: "relative" }}>
            <BrainCanvas onHover={setHovered} />
            {hovered && (
              <div style={{
                position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
                background: "#1a1a1a", color: "#F2EFE4",
                fontFamily: "monospace", fontWeight: 700, fontSize: 13,
                letterSpacing: "0.08em", padding: "5px 14px", borderRadius: 4,
                pointerEvents: "none", whiteSpace: "nowrap",
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
              }}>
                {hovered}
              </div>
            )}
          </div>

          {/* Legend */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px 10px", justifyContent: "center", maxWidth: 380 }}>
            {LOBES.map(l => (
              <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 9, height: 9, borderRadius: "50%", background: `#${l.color.toString(16).padStart(6,"0")}`, flexShrink: 0 }} />
                <span style={{ fontFamily: "monospace", fontSize: 10, color: "#4a3a1a", letterSpacing: "0.03em" }}>{l.label}</span>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "monospace", fontSize: 10, color: "#8b6914", textAlign: "center", letterSpacing: "0.08em", margin: 0 }}>
            DRAG TO ROTATE · HOVER TO EXPLORE
          </p>
        </div>

        {/* ── RIGHT: Academic info ── */}
        <div style={{ flex: "1 1 300px", display: "flex", flexDirection: "column", gap: "clamp(10px,1.6vw,20px)" }}>
          <p style={{ fontFamily: "monospace", fontSize: "clamp(9px,0.9vw,12px)", letterSpacing: "0.2em", color: "#6B1A1A", textTransform: "uppercase", margin: 0 }}>
            I am a senior majoring in
          </p>
          <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 700, fontSize: "clamp(26px,3.8vw,56px)", lineHeight: 1.05, color: "#1a1a1a", margin: 0 }}>
            Symbolic Systems
          </h2>
          <p style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: "clamp(12px,1.3vw,17px)", color: "#4a3a1a", margin: 0 }}>
            (HCI 🤝 / HAI 🧠 Concentration)
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10, borderTop: "1.5px solid rgba(107,26,26,0.2)", paddingTop: "clamp(8px,1vw,14px)" }}>
            <span style={{ fontFamily: "monospace", fontWeight: 900, fontSize: "clamp(12px,1.4vw,17px)", letterSpacing: "0.12em", color: "#8C1515", textTransform: "uppercase" }}>
              At Stanford University
            </span>
            <span style={{ fontSize: "1.2rem" }}>🌲</span>
          </div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(12px,1.1vw,15px)", color: "#4a3a1a", lineHeight: 1.65, margin: 0 }}>
            An interdisciplinary B.S. designed to explore the relationship between the human mind and artificial systems.
          </p>
          <div>
            <p style={{ fontFamily: "monospace", fontWeight: 900, fontSize: "clamp(13px,1.5vw,18px)", letterSpacing: "0.14em", color: "#6B1A1A", textTransform: "uppercase", margin: "0 0 4px" }}>Key Principles</p>
            <p style={{ fontFamily: "monospace", fontSize: 9, letterSpacing: "0.1em", color: "#8b6914", margin: "0 0 10px", textTransform: "uppercase" }}>I follow and believe in</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <PCard icon="🤝" text="People are the biggest value" />
              <PCard icon="🔄" text="Flexibility is a superpower" />
              <PCard icon="🎯" text="Do your best or don't start" />
              <PCard icon="💬" text="Good communication leads to success" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
