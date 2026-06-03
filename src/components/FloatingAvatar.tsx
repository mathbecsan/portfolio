"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// ─── Bauhaus palette ───────────────────────────────────────────────────────────
const COLOR = {
  skin: 0xc68642,
  hair: 0x1a0a00,
  blue: 0x2952a3,
  dark: 0x1a1a1a,
  eye: 0x111111,
};

// ─── Pose definitions ──────────────────────────────────────────────────────────
// Each pose key maps to target Euler rotations (x,y,z) for each joint.
// Joints: lUpperArm, rUpperArm, lForeArm, rForeArm, lThigh, rThigh, lShin, rShin, head, torso
interface PoseAngles {
  lUpperArm: [number, number, number];
  rUpperArm: [number, number, number];
  lForeArm: [number, number, number];
  rForeArm: [number, number, number];
  lThigh: [number, number, number];
  rThigh: [number, number, number];
  lShin: [number, number, number];
  rShin: [number, number, number];
  head: [number, number, number];
  torso: [number, number, number];
}

const POSES: Record<string, PoseAngles> = {
  wave: {
    lUpperArm: [0, 0, 0.3],
    rUpperArm: [-2.2, 0, -0.3],
    lForeArm: [0, 0, 0],
    rForeArm: [0.6, 0, 0],
    lThigh: [0, 0, 0],
    rThigh: [0, 0, 0],
    lShin: [0, 0, 0],
    rShin: [0, 0, 0],
    head: [0.05, 0, 0],
    torso: [0, 0, 0],
  },
  confident: {
    lUpperArm: [0, 0, 0.55],
    rUpperArm: [0, 0, -0.55],
    lForeArm: [-0.2, 0, 0],
    rForeArm: [-0.2, 0, 0],
    lThigh: [0, 0, 0],
    rThigh: [0, 0, 0],
    lShin: [0, 0, 0],
    rShin: [0, 0, 0],
    head: [-0.1, 0, 0],
    torso: [-0.06, 0, 0],
  },
  think: {
    lUpperArm: [0, 0, 0.3],
    rUpperArm: [-1.0, 0, -0.2],
    lForeArm: [0, 0, 0],
    rForeArm: [-0.9, 0, 0],
    lThigh: [0, 0, 0],
    rThigh: [0, 0, 0],
    lShin: [0, 0, 0],
    rShin: [0, 0, 0],
    head: [0.1, 0.15, 0.1],
    torso: [0.05, 0, 0],
  },
  look: {
    lUpperArm: [0, 0, 0.2],
    rUpperArm: [0, 0, -0.2],
    lForeArm: [0, 0, 0],
    rForeArm: [0, 0, 0],
    lThigh: [0, 0, 0],
    rThigh: [0, 0, 0],
    lShin: [0, 0, 0],
    rShin: [0, 0, 0],
    head: [0, 0.45, 0],
    torso: [0, 0.1, 0],
  },
  work: {
    lUpperArm: [-0.6, 0, 0.2],
    rUpperArm: [-0.6, 0, -0.2],
    lForeArm: [-0.9, 0, 0],
    rForeArm: [-0.9, 0, 0],
    lThigh: [0, 0, 0],
    rThigh: [0, 0, 0],
    lShin: [0, 0, 0],
    rShin: [0, 0, 0],
    head: [0.15, 0, 0],
    torso: [0.1, 0, 0],
  },
  celebrate: {
    lUpperArm: [-2.0, 0, 0.5],
    rUpperArm: [-2.0, 0, -0.5],
    lForeArm: [0.3, 0, 0],
    rForeArm: [0.3, 0, 0],
    lThigh: [0, 0, 0],
    rThigh: [0, 0, 0],
    lShin: [0, 0, 0],
    rShin: [0, 0, 0],
    head: [-0.2, 0, 0],
    torso: [-0.08, 0, 0],
  },
  walk: {
    lUpperArm: [-0.5, 0, 0.1],
    rUpperArm: [0.5, 0, -0.1],
    lForeArm: [0.3, 0, 0],
    rForeArm: [-0.3, 0, 0],
    lThigh: [-0.5, 0, 0],
    rThigh: [0.5, 0, 0],
    lShin: [-0.4, 0, 0],
    rShin: [0.4, 0, 0],
    head: [0, 0, 0],
    torso: [0, 0, 0],
  },
};

// Map scroll percentage to pose name
function getPoseName(scrollPct: number): string {
  if (scrollPct < 0.15) return "wave";
  if (scrollPct < 0.30) return "confident";
  if (scrollPct < 0.45) return "think";
  if (scrollPct < 0.60) return "look";
  if (scrollPct < 0.75) return "work";
  if (scrollPct < 0.90) return "celebrate";
  return "walk";
}

// Friendly display labels for the tooltip
const POSE_LABELS: Record<string, string> = {
  wave: "👋 Hey there!",
  confident: "😎 Confident",
  think: "🤔 Thinking…",
  look: "👀 Looking around",
  work: "💻 Working",
  celebrate: "🎉 Celebrate!",
  walk: "🚶 Almost there!",
};

// ─── Component ─────────────────────────────────────────────────────────────────
export default function FloatingAvatar() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [poseName, setPoseName] = useState("wave");

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(160, 220);
    renderer.setClearColor(0x000000, 0); // transparent
    container.appendChild(renderer.domElement);

    // ── Scene & Camera ────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 160 / 220, 0.1, 100);
    camera.position.set(0, 0.5, 5.5);
    camera.lookAt(0, 0.5, 0);

    // ── Lights ────────────────────────────────────────────────────────────────
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0);
    dirLight.position.set(3, 5, 5);
    scene.add(dirLight);
    const fillLight = new THREE.DirectionalLight(0xf5c500, 0.3);
    fillLight.position.set(-3, 0, 2);
    scene.add(fillLight);

    // ── Helper: make a mesh ───────────────────────────────────────────────────
    const mat = (color: number, roughness = 0.6, metalness = 0.05) =>
      new THREE.MeshStandardMaterial({ color, roughness, metalness });

    const mesh = (geo: THREE.BufferGeometry, color: number) =>
      new THREE.Mesh(geo, mat(color));

    // ── Shadow platform ───────────────────────────────────────────────────────
    const platformGeo = new THREE.CircleGeometry(0.65, 32);
    const platformMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.18,
      side: THREE.DoubleSide,
    });
    const platform = new THREE.Mesh(platformGeo, platformMat);
    platform.rotation.x = -Math.PI / 2;
    platform.position.y = -1.55;
    scene.add(platform);

    // ── Root group (for bobbing) ───────────────────────────────────────────────
    const root = new THREE.Group();
    scene.add(root);

    // ── Body parts ────────────────────────────────────────────────────────────

    // Torso
    const torso = mesh(new THREE.BoxGeometry(0.72, 0.85, 0.38), COLOR.blue);
    torso.position.y = 0;
    root.add(torso);

    // Neck
    const neck = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.2, 12), COLOR.skin);
    neck.position.y = 0.52;
    root.add(neck);

    // Head
    const head = mesh(new THREE.SphereGeometry(0.28, 20, 20), COLOR.skin);
    head.position.y = 0.87;
    root.add(head);

    // Eyes (two tiny dark spheres)
    const eyeGeo = new THREE.SphereGeometry(0.04, 8, 8);
    const leftEye = mesh(eyeGeo, COLOR.eye);
    leftEye.position.set(-0.10, 0.90, 0.27);
    root.add(leftEye);
    const rightEye = mesh(eyeGeo, COLOR.eye);
    rightEye.position.set(0.10, 0.90, 0.27);
    root.add(rightEye);

    // Hair — 4 dark spheres on top forming a fluffy tuft
    const hairPositions: [number, number, number][] = [
      [0, 1.14, 0.05],
      [-0.10, 1.11, 0],
      [0.10, 1.11, 0],
      [0, 1.10, -0.08],
    ];
    hairPositions.forEach(([hx, hy, hz]) => {
      const h = mesh(new THREE.SphereGeometry(0.115, 12, 12), COLOR.hair);
      h.position.set(hx, hy, hz);
      root.add(h);
    });

    // ── Arms ─────────────────────────────────────────────────────────────────
    // Arms are built as pivot groups so rotation = joint rotation.

    // Left upper arm pivot (at left shoulder)
    const lArmPivot = new THREE.Group();
    lArmPivot.position.set(-0.46, 0.3, 0);
    root.add(lArmPivot);

    const lUpperArm = mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.38, 12), COLOR.blue);
    lUpperArm.position.y = -0.19;
    lArmPivot.add(lUpperArm);

    // Left forearm pivot (at left elbow)
    const lElbowPivot = new THREE.Group();
    lElbowPivot.position.y = -0.38;
    lArmPivot.add(lElbowPivot);

    const lForeArm = mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.36, 12), COLOR.skin);
    lForeArm.position.y = -0.18;
    lElbowPivot.add(lForeArm);

    const lHand = mesh(new THREE.SphereGeometry(0.09, 10, 10), COLOR.skin);
    lHand.position.y = -0.38;
    lElbowPivot.add(lHand);

    // Right upper arm pivot (at right shoulder)
    const rArmPivot = new THREE.Group();
    rArmPivot.position.set(0.46, 0.3, 0);
    root.add(rArmPivot);

    const rUpperArm = mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.38, 12), COLOR.blue);
    rUpperArm.position.y = -0.19;
    rArmPivot.add(rUpperArm);

    // Right forearm pivot (at right elbow)
    const rElbowPivot = new THREE.Group();
    rElbowPivot.position.y = -0.38;
    rArmPivot.add(rElbowPivot);

    const rForeArm = mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.36, 12), COLOR.skin);
    rForeArm.position.y = -0.18;
    rElbowPivot.add(rForeArm);

    const rHand = mesh(new THREE.SphereGeometry(0.09, 10, 10), COLOR.skin);
    rHand.position.y = -0.38;
    rElbowPivot.add(rHand);

    // ── Legs ─────────────────────────────────────────────────────────────────

    // Left thigh pivot (at left hip)
    const lHipPivot = new THREE.Group();
    lHipPivot.position.set(-0.2, -0.42, 0);
    root.add(lHipPivot);

    const lThigh = mesh(new THREE.CylinderGeometry(0.115, 0.1, 0.42, 12), COLOR.dark);
    lThigh.position.y = -0.21;
    lHipPivot.add(lThigh);

    const lKneePivot = new THREE.Group();
    lKneePivot.position.y = -0.42;
    lHipPivot.add(lKneePivot);

    const lShin = mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.40, 12), COLOR.dark);
    lShin.position.y = -0.20;
    lKneePivot.add(lShin);

    const lFoot = mesh(new THREE.BoxGeometry(0.15, 0.09, 0.26), COLOR.dark);
    lFoot.position.set(0, -0.44, 0.06);
    lKneePivot.add(lFoot);

    // Right thigh pivot (at right hip)
    const rHipPivot = new THREE.Group();
    rHipPivot.position.set(0.2, -0.42, 0);
    root.add(rHipPivot);

    const rThigh = mesh(new THREE.CylinderGeometry(0.115, 0.1, 0.42, 12), COLOR.dark);
    rThigh.position.y = -0.21;
    rHipPivot.add(rThigh);

    const rKneePivot = new THREE.Group();
    rKneePivot.position.y = -0.42;
    rHipPivot.add(rKneePivot);

    const rShin = mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.40, 12), COLOR.dark);
    rShin.position.y = -0.20;
    rKneePivot.add(rShin);

    const rFoot = mesh(new THREE.BoxGeometry(0.15, 0.09, 0.26), COLOR.dark);
    rFoot.position.set(0, -0.44, 0.06);
    rKneePivot.add(rFoot);

    // ── Joint map for lerping ─────────────────────────────────────────────────
    // Maps pose key → Three.js Group
    const joints: Record<keyof PoseAngles, THREE.Object3D> = {
      lUpperArm: lArmPivot,
      rUpperArm: rArmPivot,
      lForeArm: lElbowPivot,
      rForeArm: rElbowPivot,
      lThigh: lHipPivot,
      rThigh: rHipPivot,
      lShin: lKneePivot,
      rShin: rKneePivot,
      head: head,
      torso: torso,
    };

    // ── State ─────────────────────────────────────────────────────────────────
    let currentPose = "wave";
    let scrollPct = 0;
    let animId = 0;

    // ── Scroll listener ───────────────────────────────────────────────────────
    const onScroll = () => {
      const docHeight = document.body.scrollHeight - window.innerHeight;
      scrollPct = docHeight > 0 ? window.scrollY / docHeight : 0;
      const newPose = getPoseName(scrollPct);
      if (newPose !== currentPose) {
        currentPose = newPose;
        setPoseName(newPose);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Animation loop ────────────────────────────────────────────────────────
    const LERP = 0.08; // smoothing factor

    const animate = (time: number) => {
      animId = requestAnimationFrame(animate);
      const t = time * 0.001; // seconds

      // Idle bob + sway
      root.position.y = Math.sin(t * 1.8) * 0.05;
      root.rotation.z = Math.sin(t * 0.9) * 0.015;

      // Wave oscillation on right arm
      const waving = currentPose === "wave";
      const waveOffset = waving ? Math.sin(t * 5) * 0.35 : 0;

      // Walk oscillation on legs
      const walking = currentPose === "walk";

      const target = POSES[currentPose];

      // Lerp every joint toward target
      (Object.keys(joints) as (keyof PoseAngles)[]).forEach((key) => {
        const obj = joints[key];
        const [tx, ty, tz] = target[key];

        let finalX = tx;
        let finalZ = tz;

        // Inject dynamic oscillations
        if (key === "rUpperArm" && waving) finalZ = tz + waveOffset;
        if (key === "lThigh" && walking) finalX = tx + Math.sin(t * 4) * 0.4;
        if (key === "rThigh" && walking) finalX = tx - Math.sin(t * 4) * 0.4;
        if (key === "lShin" && walking) finalX = tx - Math.max(0, Math.sin(t * 4)) * 0.35;
        if (key === "rShin" && walking) finalX = tx + Math.max(0, Math.sin(t * 4)) * 0.35;
        if (key === "lUpperArm" && walking) finalX = tx - Math.sin(t * 4) * 0.3;
        if (key === "rUpperArm" && walking) finalX = tx + Math.sin(t * 4) * 0.3;

        obj.rotation.x += (finalX - obj.rotation.x) * LERP;
        obj.rotation.y += (ty - obj.rotation.y) * LERP;
        obj.rotation.z += (finalZ - obj.rotation.z) * LERP;
      });

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("scroll", onScroll);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 999,
        width: "160px",
        height: "220px",
        cursor: "default",
        userSelect: "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Three.js canvas mount point */}
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />

      {/* Tooltip */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            right: 0,
            background: "rgba(41,82,163,0.92)",
            color: "#f0ede6",
            fontSize: "12px",
            fontFamily: "monospace",
            padding: "5px 10px",
            borderRadius: "6px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
            letterSpacing: "0.03em",
          }}
        >
          {POSE_LABELS[poseName] ?? poseName}
        </div>
      )}
    </div>
  );
}
