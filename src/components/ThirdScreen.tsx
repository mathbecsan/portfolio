"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";

// ── Brain lobe definitions (anatomically placed) ───────────────
const LOBES = [
  {
    id: "hci", label: "HCI", color: 0x2952A3,
    parts: [
      { p: [-0.36, 0.52, 0.72] as [number,number,number], s: [0.60, 0.52, 0.56] as [number,number,number] },
      { p: [ 0.36, 0.52, 0.72] as [number,number,number], s: [0.60, 0.52, 0.56] as [number,number,number] },
      { p: [ 0.00, 0.68, 0.52] as [number,number,number], s: [0.46, 0.40, 0.42] as [number,number,number] },
    ],
  },
  {
    id: "hai", label: "HAI", color: 0xE63329,
    parts: [
      { p: [-0.38, 0.82, 0.04] as [number,number,number], s: [0.54, 0.48, 0.50] as [number,number,number] },
      { p: [ 0.38, 0.82, 0.04] as [number,number,number], s: [0.54, 0.48, 0.50] as [number,number,number] },
      { p: [ 0.00, 0.90,-0.18] as [number,number,number], s: [0.40, 0.38, 0.42] as [number,number,number] },
    ],
  },
  {
    id: "neuro", label: "Neuroscience", color: 0xF5A623,
    parts: [
      { p: [-0.26, 0.44,-0.80] as [number,number,number], s: [0.50, 0.46, 0.44] as [number,number,number] },
      { p: [ 0.26, 0.44,-0.80] as [number,number,number], s: [0.50, 0.46, 0.44] as [number,number,number] },
    ],
  },
  {
    id: "linguistics", label: "Linguistics", color: 0xE9C46A,
    parts: [
      { p: [-0.90, 0.04, 0.18] as [number,number,number], s: [0.50, 0.42, 0.54] as [number,number,number] },
      { p: [ 0.90, 0.04, 0.18] as [number,number,number], s: [0.50, 0.42, 0.54] as [number,number,number] },
      { p: [-0.80,-0.14,-0.14] as [number,number,number], s: [0.38, 0.36, 0.38] as [number,number,number] },
      { p: [ 0.80,-0.14,-0.14] as [number,number,number], s: [0.38, 0.36, 0.38] as [number,number,number] },
    ],
  },
  {
    id: "psych", label: "Psychology", color: 0x2A9D8F,
    parts: [
      { p: [-0.68, 0.26, 0.36] as [number,number,number], s: [0.42, 0.38, 0.40] as [number,number,number] },
      { p: [ 0.68, 0.26, 0.36] as [number,number,number], s: [0.42, 0.38, 0.40] as [number,number,number] },
    ],
  },
  {
    id: "philosophy", label: "Philosophy", color: 0x6A4C93,
    parts: [
      { p: [-0.17, 0.26, 0.96] as [number,number,number], s: [0.36, 0.32, 0.34] as [number,number,number] },
      { p: [ 0.17, 0.26, 0.96] as [number,number,number], s: [0.36, 0.32, 0.34] as [number,number,number] },
    ],
  },
  {
    id: "design", label: "Design", color: 0xE76F51,
    parts: [
      { p: [-0.21, 0.60, 0.38] as [number,number,number], s: [0.34, 0.30, 0.32] as [number,number,number] },
      { p: [ 0.21, 0.60, 0.38] as [number,number,number], s: [0.34, 0.30, 0.32] as [number,number,number] },
    ],
  },
  {
    id: "cogsci", label: "Cognition Research", color: 0x264653,
    parts: [
      { p: [ 0.00,-1.02,-0.52] as [number,number,number], s: [0.70, 0.46, 0.60] as [number,number,number] },
      { p: [-0.36,-0.98,-0.38] as [number,number,number], s: [0.34, 0.28, 0.36] as [number,number,number] },
      { p: [ 0.36,-0.98,-0.38] as [number,number,number], s: [0.34, 0.28, 0.36] as [number,number,number] },
    ],
  },
];

// ── BrainCanvas ────────────────────────────────────────────────
function BrainCanvas({ onHover }: { onHover: (label: string | null) => void }) {
  const mountRef   = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const lastMouse  = useRef({ x: 0, y: 0 });
  const groupRef   = useRef<THREE.Group | null>(null);
  const lobeMeshes = useRef<THREE.Mesh[]>([]);
  const rafRef     = useRef(0);

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
    const camera = new THREE.PerspectiveCamera(40, W / H, 0.1, 100);
    camera.position.set(0, 0.3, 6.0);

    // Lighting
    scene.add(new THREE.AmbientLight(0xfff5e0, 0.6));
    const key = new THREE.DirectionalLight(0xffffff, 1.5);
    key.position.set(4, 6, 5); key.castShadow = true; scene.add(key);
    const rim = new THREE.DirectionalLight(0xF5A623, 0.5);
    rim.position.set(-4, 1, -3); scene.add(rim);
    const fill = new THREE.DirectionalLight(0xaac8ff, 0.35);
    fill.position.set(0, -3, 4); scene.add(fill);
    const inner = new THREE.PointLight(0xffccaa, 0.5, 6);
    inner.position.set(0, 0.2, 0.5); scene.add(inner);

    const group = new THREE.Group();
    groupRef.current = group;
    scene.add(group);

    // ── Cerebrum hemispheres ───────────────────────────────────
    ([-0.13, 0.13] as number[]).forEach((xOff, hi) => {
      const geo = new THREE.SphereGeometry(0.97, 64, 48);
      geo.scale(0.98, 0.84, 0.88);
      const mat = new THREE.MeshPhongMaterial({
        color: hi === 0 ? 0xf0c4a0 : 0xedd4b0,
        shininess: 22, transparent: true, opacity: 0.75,
      });
      const m = new THREE.Mesh(geo, mat);
      m.position.set(xOff, 0, 0);
      group.add(m);
    });

    // Core (slight transparency)
    const coreGeo = new THREE.SphereGeometry(1.04, 64, 64);
    coreGeo.scale(1, 0.85, 0.90);
    group.add(new THREE.Mesh(coreGeo, new THREE.MeshPhongMaterial({
      color: 0xf2cfa8, shininess: 10, transparent: true, opacity: 0.12,
    })));

    // Inter-hemisphere groove
    const grooveGeo = new THREE.CylinderGeometry(0.013, 0.013, 1.85, 8);
    const groove = new THREE.Mesh(grooveGeo, new THREE.MeshBasicMaterial({ color: 0x8b5e3c }));
    groove.position.set(0, 0.05, 0);
    group.add(groove);

    // Gyri surface bumps (56 total, both hemispheres)
    const gyriBase = Array.from({ length: 28 }, (_, i) => {
      const theta = (i / 28) * Math.PI * 2;
      const phi   = (i % 7) * (Math.PI / 8) + 0.3;
      const r = 0.94 + Math.sin(i * 7.3) * 0.07;
      return {
        x: r * Math.sin(phi) * Math.cos(theta) * 0.64,
        y: r * Math.cos(phi) * 0.82,
        z: r * Math.sin(phi) * Math.sin(theta) * 0.87,
        s: 0.09 + Math.abs(Math.sin(i * 3.7)) * 0.09,
      };
    });
    [...gyriBase.map(g => ({ ...g, x: -g.x })), ...gyriBase].forEach(g => {
      const geo = new THREE.SphereGeometry(g.s, 8, 7);
      const mesh = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({
        color: 0xe8b48a, shininess: 8, transparent: true, opacity: 0.82,
      }));
      mesh.position.set(g.x, g.y, g.z);
      group.add(mesh);
    });

    // Wire sulci overlay
    const wireGeo = new THREE.SphereGeometry(1.06, 16, 12);
    wireGeo.scale(1, 0.85, 0.90);
    group.add(new THREE.Mesh(wireGeo, new THREE.MeshBasicMaterial({
      color: 0x7a4a2a, wireframe: true, transparent: true, opacity: 0.04,
    })));

    // Lobe blobs
    const allLobes: THREE.Mesh[] = [];
    LOBES.forEach(lobe => {
      lobe.parts.forEach(part => {
        const geo = new THREE.SphereGeometry(0.5, 32, 24);
        geo.scale(...part.s);
        const mat = new THREE.MeshPhongMaterial({
          color: lobe.color, shininess: 60, transparent: true, opacity: 0.78,
        });
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(...part.p);
        mesh.userData = { label: lobe.label, color: lobe.color, baseOp: 0.78 };
        group.add(mesh);
        allLobes.push(mesh);
      });
    });
    lobeMeshes.current = allLobes;

    // Brain stem + pedestal
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.13, 0.19, 0.82, 16),
      new THREE.MeshPhongMaterial({ color: 0xd4956a, shininess: 20 })
    );
    stem.position.set(0, -1.50, 0.05);
    group.add(stem);

    const ped = new THREE.Mesh(
      new THREE.CylinderGeometry(0.48, 0.62, 0.20, 32),
      new THREE.MeshPhongMaterial({ color: 0xc8a078, shininess: 45 })
    );
    ped.position.set(0, -1.99, 0);
    group.add(ped);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse2    = new THREE.Vector2();
    let hovered: THREE.Mesh | null = null;

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      mouse2.x =  ((e.clientX - rect.left) / rect.width)  * 2 - 1;
      mouse2.y = -((e.clientY - rect.top)  / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse2, camera);
      const hits = raycaster.intersectObjects(allLobes);
      if (hits.length > 0) {
        const hit = hits[0].object as THREE.Mesh;
        if (hit !== hovered) {
          if (hovered) { (hovered.material as THREE.MeshPhongMaterial).opacity = hovered.userData.baseOp; (hovered.material as THREE.MeshPhongMaterial).emissiveIntensity = 0; }
          hovered = hit;
          (hit.material as THREE.MeshPhongMaterial).opacity = 1;
          (hit.material as THREE.MeshPhongMaterial).emissive.setHex(hit.userData.color);
          (hit.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.25;
          onHover(hit.userData.label);
          mount.style.cursor = "pointer";
        }
      } else {
        if (hovered) { (hovered.material as THREE.MeshPhongMaterial).opacity = hovered.userData.baseOp; (hovered.material as THREE.MeshPhongMaterial).emissiveIntensity = 0; hovered = null; onHover(null); mount.style.cursor = "grab"; }
      }
      if (isDragging.current) {
        const dx = e.clientX - lastMouse.current.x, dy = e.clientY - lastMouse.current.y;
        group.rotation.y += dx * 0.012;
        group.rotation.x = Math.max(-0.55, Math.min(0.55, group.rotation.x + dy * 0.008));
        lastMouse.current = { x: e.clientX, y: e.clientY };
      }
    };
    const onDown = (e: MouseEvent) => { isDragging.current = true; lastMouse.current = { x: e.clientX, y: e.clientY }; mount.style.cursor = "grabbing"; };
    const onUp   = () => { isDragging.current = false; mount.style.cursor = "grab"; };

    const onTouchStart = (e: TouchEvent) => { isDragging.current = true; lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
    const onTouchMove  = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].clientX - lastMouse.current.x, dy = e.touches[0].clientY - lastMouse.current.y;
      group.rotation.y += dx * 0.012;
      group.rotation.x = Math.max(-0.55, Math.min(0.55, group.rotation.x + dy * 0.008));
      lastMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    mount.addEventListener("mousemove",  onMouseMove);
    mount.addEventListener("mousedown",  onDown);
    mount.addEventListener("mouseup",    onUp);
    mount.addEventListener("mouseleave", onUp);
    mount.addEventListener("touchstart", onTouchStart, { passive: true });
    mount.addEventListener("touchmove",  onTouchMove,  { passive: true });
    mount.addEventListener("touchend",   onUp);
    mount.style.cursor = "grab";

    let t = 0;
    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      t += 0.006;
      if (!isDragging.current) group.rotation.y += 0.0022;
      allLobes.forEach((m, i) => {
        if ((m.material as THREE.MeshPhongMaterial).emissiveIntensity < 0.1)
          m.scale.setScalar(1 + 0.022 * Math.sin(t + i * 0.55));
      });
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => { const w = mount.clientWidth, h = mount.clientHeight; camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h); };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      mount.removeEventListener("mousemove",  onMouseMove);
      mount.removeEventListener("mousedown",  onDown);
      mount.removeEventListener("mouseup",    onUp);
      mount.removeEventListener("mouseleave", onUp);
      mount.removeEventListener("touchstart", onTouchStart);
      mount.removeEventListener("touchmove",  onTouchMove);
      mount.removeEventListener("touchend",   onUp);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [onHover]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
}

// ── ThirdScreen ────────────────────────────────────────────────
export default function ThirdScreen() {
  const [hovered, setHovered] = useState<string | null>(null);
  const handleHover = useCallback((label: string | null) => setHovered(label), []);

  return (
    <section style={{ position: "relative", overflow: "hidden", background: "#F2EFE4" }}>

      {/* ── body.svg provides the full layout frame ── */}
      <img
        src="/screen3/body.svg"
        alt=""
        aria-hidden="true"
        style={{ width: "100%", height: "auto", display: "block" }}
      />

      {/* ── Three.js brain — overlaid on the left empty area ──
          SVG is 2825×1133. The brain placeholder occupies roughly
          x: 64–870 (2.3%–30.8%), y: 200–920 (17.7%–81.2%)
          Brain center ≈ x:16%, y:50% of the SVG               */}
      <div style={{
        position: "absolute",
        left:   "2%",
        top:    "16%",
        width:  "30%",
        /* height matches aspect of the SVG column */
        aspectRatio: "1 / 1.1",
        pointerEvents: "auto",
      }}>
        <BrainCanvas onHover={handleHover} />

        {/* Hover tooltip */}
        {hovered && (
          <div style={{
            position: "absolute", top: "6%", left: "50%",
            transform: "translateX(-50%)",
            background: "#1a1a1a", color: "#F2EFE4",
            fontFamily: "monospace", fontWeight: 700,
            fontSize: "clamp(10px, 1.1vw, 14px)",
            letterSpacing: "0.08em",
            padding: "5px 14px", borderRadius: 4,
            pointerEvents: "none", whiteSpace: "nowrap",
            boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
            zIndex: 10,
          }}>
            {hovered}
          </div>
        )}
      </div>

      {/* ── Legend + hint below brain ── */}
      <div style={{
        position: "absolute",
        left: "2%",
        top:  "82%",
        width: "30%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
      }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px 8px", justifyContent: "center" }}>
          {LOBES.map(l => (
            <div key={l.id} style={{ display: "flex", alignItems: "center", gap: 3 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: `#${l.color.toString(16).padStart(6,"0")}`, flexShrink: 0 }} />
              <span style={{ fontFamily: "monospace", fontSize: "clamp(7px, 0.8vw, 10px)", color: "#4a3a1a" }}>{l.label}</span>
            </div>
          ))}
        </div>
        <p style={{ fontFamily: "monospace", fontSize: "clamp(7px, 0.7vw, 9px)", color: "#8b6914", letterSpacing: "0.08em", margin: 0, textAlign: "center" }}>
          DRAG TO ROTATE · HOVER TO EXPLORE
        </p>
      </div>
    </section>
  );
}
