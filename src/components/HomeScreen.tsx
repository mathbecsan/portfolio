"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import ThirdScreen from "./ThirdScreen";
import FourthScreen from "./FourthScreen";
import FifthScreen from "./FifthScreen";
import SixthScreen from "./SixthScreen";
import SeventhScreen from "./SeventhScreen";

const NAV = ["Home", "About", "Process", "Impact"];

const GREETINGS = [
  { text: "Allinllachu.", lang: "Quechua",    script: "Latin"       },
  { text: "Hello.",       lang: "English",    script: "Latin"       },
  { text: "Bonjour.",     lang: "French",     script: "Latin"       },
  { text: "こんにちは。",  lang: "Japanese",   script: "Kanji"       },
  { text: "مرحباً.",      lang: "Arabic",     script: "Arabic"      },
  { text: "안녕하세요.",   lang: "Korean",     script: "Hangul"      },
  { text: "नमस्ते.",      lang: "Hindi",      script: "Devanagari"  },
  { text: "Привет.",      lang: "Russian",    script: "Cyrillic"    },
  { text: "שָׁלוֹם.",     lang: "Hebrew",     script: "Hebrew"      },
  { text: "Hola.",        lang: "Spanish",    script: "Latin"       },
  { text: "สวัสดี.",       lang: "Thai",       script: "Thai"        },
  { text: "Merhaba.",     lang: "Turkish",    script: "Latin"       },
  { text: "Olá.",         lang: "Portuguese", script: "Latin"       },
];

const ROLES = [
  { src: "/first-screen/role-uxui.svg",      label: "UX/UI Engineer"      },
  { src: "/first-screen/role-data.svg",      label: "Data Scientist"      },
  { src: "/first-screen/role-product.svg",   label: "Product Designer"    },
  { src: "/first-screen/role-fullstack.svg", label: "Fullstack Developer" },
];

const WORDS = ["design", "build", "program"];

// ── Build a joint pivot group ──────────────────────────────────
function pivot(x=0,y=0,z=0): THREE.Group {
  const g = new THREE.Group(); g.position.set(x,y,z); return g;
}
function limb(h: number, r: number, col: number, yOff=-h/2): THREE.Mesh {
  const g = new THREE.CylinderGeometry(r,r,h,14);
  g.translate(0, yOff, 0);
  return new THREE.Mesh(g, new THREE.MeshPhongMaterial({ color: col, shininess: 30 }));
}

// ── Character + particle background ───────────────────────────
function useThreeBackground(mountRef: RefObject<HTMLDivElement | null>) {
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
    const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
    camera.position.set(0, 0, 9);

    // ── Lights ─────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(3, 6, 6); scene.add(key);
    const rim = new THREE.DirectionalLight(0x2952a3, 0.5);
    rim.position.set(-4, 0, -4); scene.add(rim);

    // ── PARTICLE NETWORK (background) ─────────────────────────
    const PC = 90;
    const pPos = new Float32Array(PC * 3);
    const pVel: THREE.Vector3[] = [];
    for (let i = 0; i < PC; i++) {
      pPos[i*3]   = (Math.random()-0.5)*16;
      pPos[i*3+1] = (Math.random()-0.5)*11;
      pPos[i*3+2] = (Math.random()-0.5)*6 - 5;
      pVel.push(new THREE.Vector3((Math.random()-.5)*.004,(Math.random()-.5)*.004,0));
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    scene.add(new THREE.Points(pGeo,
      new THREE.PointsMaterial({ color: 0xf0ede6, size: 0.048, transparent: true, opacity: 0.38 })));

    const lGeo = new THREE.BufferGeometry();
    const lPos = new Float32Array(PC * 4 * 6);
    lGeo.setAttribute("position", new THREE.BufferAttribute(lPos, 3));
    const lines = new THREE.LineSegments(lGeo,
      new THREE.LineBasicMaterial({ color: 0xf0ede6, transparent: true, opacity: 0.07 }));
    scene.add(lines);

    // ── MATHIAS CHARACTER ──────────────────────────────────────
    const SKIN  = 0xc68642;
    const SHIRT = 0x2952a3;  // Bauhaus blue
    const PANT  = 0x1a1a1a;
    const SHOE  = 0x111111;
    const HAIR  = 0x1a0800;

    const char = new THREE.Group();
    char.position.set(3.8, -0.5, 0);
    scene.add(char);

    // Torso
    const torsoGrp = new THREE.Group();
    char.add(torsoGrp);
    const torsoMesh = new THREE.Mesh(
      new THREE.BoxGeometry(0.88, 1.2, 0.52),
      new THREE.MeshPhongMaterial({ color: SHIRT, shininess: 40 })
    );
    torsoMesh.position.y = 0.6;
    torsoGrp.add(torsoMesh);

    // Collar accent stripe
    const collar = new THREE.Mesh(
      new THREE.BoxGeometry(0.9, 0.1, 0.55),
      new THREE.MeshPhongMaterial({ color: 0xe63329 })
    );
    collar.position.y = 1.22;
    torsoGrp.add(collar);

    // Neck
    const neck = limb(0.22, 0.14, SKIN, -0.11);
    neck.position.set(0, 1.32, 0);
    torsoGrp.add(neck);

    // ── Head group ──────────────────────────────────────────────
    const headPivot = pivot(0, 1.6, 0);
    torsoGrp.add(headPivot);

    const headMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.42, 28, 22),
      new THREE.MeshPhongMaterial({ color: SKIN, shininess: 18 })
    );
    headMesh.position.y = 0.42;
    headPivot.add(headMesh);

    // Eyes
    [[-0.14, 0.0, 0.35],[0.14, 0.0, 0.35]].forEach(([x,y,z]) => {
      const eye = new THREE.Mesh(
        new THREE.SphereGeometry(0.065, 10, 8),
        new THREE.MeshPhongMaterial({ color: 0x111111 })
      );
      eye.position.set(x, 0.42 + y, z);
      headPivot.add(eye);
      // white highlight
      const hl = new THREE.Mesh(new THREE.SphereGeometry(0.022,6,6),
        new THREE.MeshBasicMaterial({ color: 0xffffff }));
      hl.position.set(x + 0.025, 0.42 + 0.025, z + 0.01);
      headPivot.add(hl);
    });

    // Hair (4 dark bumps)
    [[0,0.84,0.06],[0.16,0.78,-0.04],[-0.16,0.78,-0.04],[0,0.76,-0.2]].forEach(([x,y,z]) => {
      const h = new THREE.Mesh(new THREE.SphereGeometry(0.25,12,10),
        new THREE.MeshPhongMaterial({ color: HAIR }));
      h.position.set(x, y, z);
      headPivot.add(h);
    });

    // ── Arms ───────────────────────────────────────────────────
    // Right arm (viewer's left)
    const rShoulderPivot = pivot( 0.54, 1.1, 0);
    torsoGrp.add(rShoulderPivot);
    const rUpperArm = limb(0.56, 0.145, SHIRT, -0.28);
    rShoulderPivot.add(rUpperArm);
    const rElbowPivot = pivot(0, -0.56, 0);
    rShoulderPivot.add(rElbowPivot);
    const rForeArm = limb(0.50, 0.12, SKIN, -0.25);
    rElbowPivot.add(rForeArm);
    const rHandMesh = new THREE.Mesh(new THREE.SphereGeometry(0.13,10,8),
      new THREE.MeshPhongMaterial({ color: SKIN }));
    rHandMesh.position.set(0, -0.51, 0);
    rElbowPivot.add(rHandMesh);

    // Left arm
    const lShoulderPivot = pivot(-0.54, 1.1, 0);
    torsoGrp.add(lShoulderPivot);
    const lUpperArm = limb(0.56, 0.145, SHIRT, -0.28);
    lShoulderPivot.add(lUpperArm);
    const lElbowPivot = pivot(0, -0.56, 0);
    lShoulderPivot.add(lElbowPivot);
    const lForeArm = limb(0.50, 0.12, SKIN, -0.25);
    lElbowPivot.add(lForeArm);
    const lHandMesh = new THREE.Mesh(new THREE.SphereGeometry(0.13,10,8),
      new THREE.MeshPhongMaterial({ color: SKIN }));
    lHandMesh.position.set(0, -0.51, 0);
    lElbowPivot.add(lHandMesh);

    // ── Legs ───────────────────────────────────────────────────
    const rHipPivot = pivot( 0.26, 0, 0);
    torsoGrp.add(rHipPivot);
    const rThigh = limb(0.64, 0.17, PANT, -0.32);
    rHipPivot.add(rThigh);
    const rKneePivot = pivot(0, -0.64, 0);
    rHipPivot.add(rKneePivot);
    const rShin = limb(0.56, 0.13, PANT, -0.28);
    rKneePivot.add(rShin);
    const rFoot = new THREE.Mesh(new THREE.BoxGeometry(0.22,0.12,0.36),
      new THREE.MeshPhongMaterial({ color: SHOE }));
    rFoot.position.set(0.04, -0.58, 0.06);
    rKneePivot.add(rFoot);

    const lHipPivot = pivot(-0.26, 0, 0);
    torsoGrp.add(lHipPivot);
    const lThigh = limb(0.64, 0.17, PANT, -0.32);
    lHipPivot.add(lThigh);
    const lKneePivot = pivot(0, -0.64, 0);
    lHipPivot.add(lKneePivot);
    const lShin = limb(0.56, 0.13, PANT, -0.28);
    lKneePivot.add(lShin);
    const lFoot = new THREE.Mesh(new THREE.BoxGeometry(0.22,0.12,0.36),
      new THREE.MeshPhongMaterial({ color: SHOE }));
    lFoot.position.set(-0.04, -0.58, 0.06);
    lKneePivot.add(lFoot);

    // Shadow plane
    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.7, 32),
      new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, -1.28, 0);
    char.add(shadow);

    // ── Poses ─────────────────────────────────────────────────
    // [rShoulderZ, rElbowZ, lShoulderZ, lElbowZ, rHipX, rKneeX, lHipX, lKneeX, headY, torsoY]
    type Pose = { rSh:[number,number,number]; rEl:[number,number,number]; lSh:[number,number,number]; lEl:[number,number,number]; rHip:number; rKnee:number; lHip:number; lKnee:number; headY:number; bodyY:number; };
    const POSES: Record<string,Pose> = {
      wave:      { rSh:[-1.6, 0,-0.3], rEl:[0.9,0,0], lSh:[0.2,0,0.1], lEl:[-0.1,0,0], rHip:0, rKnee:0, lHip:0, lKnee:0, headY:0.05, bodyY:0 },
      confident: { rSh:[0.1,0, 0.15], rEl:[-0.2,0,0], lSh:[0.1,0,-0.15], lEl:[-0.2,0,0], rHip:0, rKnee:0, lHip:0, lKnee:0, headY:0, bodyY:0 },
      think:     { rSh:[-0.9,0,-0.2], rEl:[1.1,0,0], lSh:[0.1,0,0.12], lEl:[-0.1,0,0], rHip:0, rKnee:0, lHip:0, lKnee:0, headY:0.12, bodyY:0 },
      look:      { rSh:[0.05,0,0.1], rEl:[0,0,0], lSh:[0.05,0,-0.1], lEl:[0,0,0], rHip:0, rKnee:0, lHip:0, lKnee:0, headY:-0.4, bodyY:0 },
      work:      { rSh:[-0.5,0,-0.4], rEl:[0.7,0,0], lSh:[-0.5,0,0.4], lEl:[0.7,0,0], rHip:0, rKnee:0, lHip:0, lKnee:0, headY:0, bodyY:-0.05 },
      celebrate: { rSh:[-2.0,0,-0.2], rEl:[-0.3,0,0], lSh:[-2.0,0,0.2], lEl:[-0.3,0,0], rHip:0, rKnee:0, lHip:0, lKnee:0, headY:0, bodyY:0.05 },
      walk:      { rSh:[0.4,0,0.1], rEl:[-0.2,0,0], lSh:[-0.4,0,-0.1], lEl:[0.2,0,0], rHip:0.4, rKnee:-0.5, lHip:-0.4, lKnee:0.2, headY:0, bodyY:0 },
    };

    const cur = {
      rShX:0, rShZ:0.1, rElX:0, lShX:0, lShZ:-0.1, lElX:0,
      rHipX:0, rKneeX:0, lHipX:0, lKneeX:0, headY:0, bodyY:0,
    };

    // Mouse + scroll state
    const mouse = { x:0, y:0, tx:0, ty:0 };
    let scrollProg = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouse.tx =  (e.clientX / window.innerWidth  - 0.5) * 2;
      mouse.ty = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onScroll = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollProg = max > 0 ? window.scrollY / max : 0;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("scroll", onScroll, { passive: true });

    function lerpVal(c: number, t: number, f=0.07) { return c + (t-c)*f; }

    let raf: number, t = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.012;

      // Smooth mouse
      mouse.x += (mouse.tx - mouse.x) * 0.055;
      mouse.y += (mouse.ty - mouse.y) * 0.055;

      // Pick pose from scroll
      const sp = scrollProg;
      let poseName = "wave";
      if      (sp > 0.84) poseName = "walk";
      else if (sp > 0.70) poseName = "celebrate";
      else if (sp > 0.56) poseName = "work";
      else if (sp > 0.42) poseName = "look";
      else if (sp > 0.28) poseName = "think";
      else if (sp > 0.14) poseName = "confident";

      const P = POSES[poseName];

      // Wave oscillation on top of target
      const waveOsc = poseName === "wave" ? Math.sin(t * 5) * 0.35 : 0;
      // Walk oscillation
      const walkOsc = poseName === "walk" ? Math.sin(t * 4) : 0;

      // Lerp all joints
      cur.rShX   = lerpVal(cur.rShX,   P.rSh[0] + (poseName==="walk" ? walkOsc*0.4 : 0));
      cur.rShZ   = lerpVal(cur.rShZ,   P.rSh[2]);
      cur.rElX   = lerpVal(cur.rElX,   P.rEl[0] + waveOsc);
      cur.lShX   = lerpVal(cur.lShX,   P.lSh[0] + (poseName==="walk" ? -walkOsc*0.4 : 0));
      cur.lShZ   = lerpVal(cur.lShZ,   P.lSh[2]);
      cur.lElX   = lerpVal(cur.lElX,   P.lEl[0]);
      cur.rHipX  = lerpVal(cur.rHipX,  poseName==="walk" ? walkOsc*0.5  : P.rHip);
      cur.rKneeX = lerpVal(cur.rKneeX, poseName==="walk" ? Math.max(0,-walkOsc)*0.7 : P.rKnee);
      cur.lHipX  = lerpVal(cur.lHipX,  poseName==="walk" ? -walkOsc*0.5 : P.lHip);
      cur.lKneeX = lerpVal(cur.lKneeX, poseName==="walk" ? Math.max(0,walkOsc)*0.7 : P.lKnee);
      cur.headY  = lerpVal(cur.headY,  P.headY + mouse.x * 0.3);
      cur.bodyY  = lerpVal(cur.bodyY,  P.bodyY);

      // Apply to joints
      rShoulderPivot.rotation.x = cur.rShX;
      rShoulderPivot.rotation.z = cur.rShZ;
      rElbowPivot.rotation.x    = cur.rElX;
      lShoulderPivot.rotation.x = cur.lShX;
      lShoulderPivot.rotation.z = cur.lShZ;
      lElbowPivot.rotation.x    = cur.lElX;
      rHipPivot.rotation.x      = cur.rHipX;
      rKneePivot.rotation.x     = cur.rKneeX;
      lHipPivot.rotation.x      = cur.lHipX;
      lKneePivot.rotation.x     = cur.lKneeX;
      headPivot.rotation.y      = cur.headY;
      torsoGrp.rotation.y       = cur.bodyY + mouse.x * 0.12;

      // Idle bob + breathe
      char.position.y = -0.5 + Math.sin(t * 1.6) * 0.055;
      char.position.x = 3.8 + Math.sin(t * 0.8) * 0.04 + mouse.x * 0.2;
      // Slight breathe on torso scale
      const breathe = 1 + Math.sin(t * 1.8) * 0.012;
      torsoMesh.scale.set(breathe, 1, breathe);

      // Camera subtle tilt following mouse
      camera.position.x = mouse.x * 0.25;
      camera.position.y = mouse.y * 0.18;
      camera.lookAt(0, 0, 0);

      // Particles
      for (let i = 0; i < PC; i++) {
        pPos[i*3]   += pVel[i].x; if (Math.abs(pPos[i*3])   > 8)  pVel[i].x *= -1;
        pPos[i*3+1] += pVel[i].y; if (Math.abs(pPos[i*3+1]) > 5.5) pVel[i].y *= -1;
      }
      pGeo.attributes.position.needsUpdate = true;

      // Connection lines
      let li = 0;
      for (let i = 0; i < PC && li < PC*4-1; i++) {
        for (let j = i+1; j < PC && li < PC*4-1; j++) {
          const dx=pPos[i*3]-pPos[j*3], dy=pPos[i*3+1]-pPos[j*3+1];
          if (dx*dx+dy*dy < 12) {
            lPos[li*6]=pPos[i*3]; lPos[li*6+1]=pPos[i*3+1]; lPos[li*6+2]=pPos[i*3+2];
            lPos[li*6+3]=pPos[j*3]; lPos[li*6+4]=pPos[j*3+1]; lPos[li*6+5]=pPos[j*3+2];
            li++;
          }
        }
      }
      for (let k=li; k<PC*4; k++) lPos[k*6]=lPos[k*6+1]=lPos[k*6+2]=lPos[k*6+3]=lPos[k*6+4]=lPos[k*6+5]=0;
      lGeo.attributes.position.needsUpdate = true;
      lGeo.setDrawRange(0, li*2);

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
      window.removeEventListener("scroll", onScroll);
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
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

// ── HomeScreen ────────────────────────────────────────────────
export default function HomeScreen({ visible }: { visible: boolean }) {
  const mountRef   = useRef<HTMLDivElement | null>(null);
  const posterRef  = useRef<HTMLElement | null>(null);
  const [idx,      setIdx]      = useState(0);
  const [animKey,  setAnimKey]  = useState(0);
  const [roleIdx,  setRoleIdx]  = useState(0);
  const [wordIdx,  setWordIdx]  = useState(0);
  const [greetExit, setGreetExit] = useState(false);
  const [roleExit,  setRoleExit]  = useState(false);
  const [wordExit,  setWordExit]  = useState(false);
  const [fadeIn,   setFadeIn]   = useState(false);
  const posterVisible = useReveal(posterRef as RefObject<HTMLElement>);

  useThreeBackground(mountRef);

  useEffect(() => { if (visible) setTimeout(() => setFadeIn(true), 100); }, [visible]);

  // Greeting cycles every 2.2s
  useEffect(() => {
    const t = setInterval(() => {
      setGreetExit(true);
      setTimeout(() => { setIdx(p => (p + 1) % GREETINGS.length); setAnimKey(p => p + 1); setGreetExit(false); }, 300);
    }, 2200);
    return () => clearInterval(t);
  }, []);

  // Role + word cycle every 3s
  useEffect(() => {
    const t = setInterval(() => {
      setRoleExit(true); setWordExit(true);
      setTimeout(() => {
        setRoleIdx(p => (p + 1) % ROLES.length);
        setWordIdx(p => (p + 1) % WORDS.length);
        setRoleExit(false); setWordExit(false);
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
      `}</style>

      {/* ══════════════════════════════════════════════
          SECTION 1 — Dark hero (full viewport)
      ══════════════════════════════════════════════ */}
      <section className="relative flex flex-col overflow-hidden bg-[#0d0d0d]"
        style={{ height: "100svh", minHeight: 600, padding: "3vh 6vw 2vh" }}>

        <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none" style={{ left: "45%" }} />
        <div className="absolute inset-0 z-[1] pointer-events-none"
          style={{ backgroundImage: "linear-gradient(90deg,rgba(255,255,255,0.04) 1px,transparent 1px)", backgroundSize: "100px 100%" }} />

        {/* Nav — plain links, no background image */}
        <nav className="relative z-10 flex justify-between items-center mb-auto pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center font-mono font-bold text-white text-sm"
              style={{ width: 36, height: 36, background: "#2952A3", borderRadius: 4, letterSpacing: "0.05em" }}>MB</div>
            <span className="text-xs uppercase tracking-[0.1em] text-[#f0ede6]/80">Portfolio</span>
          </div>
          <div className="flex gap-6 font-mono text-xs text-[#f0ede6]/40 tracking-[0.2em] uppercase">
            {NAV.map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="hover:text-[#f0ede6] transition-colors">{l}</a>
            ))}
          </div>
        </nav>

        {/* Greeting + name */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          <div className="overflow-hidden" style={{ lineHeight: 1.05, direction: isRTL ? "rtl" : "ltr" }}>
            <span key={animKey} className="block font-mono text-[#f0ede6]"
              style={{
                fontSize: "clamp(44px, 8vw, 120px)",
                opacity: greetExit ? 0 : 1,
                transform: greetExit ? "translateY(-28px)" : undefined,
                transition: greetExit ? "opacity 0.28s ease, transform 0.28s ease" : "none",
                animation: !greetExit ? "greetIn 0.42s cubic-bezier(0.22,1,0.36,1) forwards" : "none",
              }}>
              {GREETINGS[idx].text}
            </span>
          </div>
          <p className="font-mono text-[#f0ede6] leading-none mt-1" style={{ fontSize: "clamp(32px, 5.5vw, 88px)" }}>i&apos;m</p>
          <h1 className="font-mono font-bold text-[#f0ede6] leading-none tracking-tight" style={{ fontSize: "clamp(44px, 7.5vw, 118px)" }}>mathias.</h1>
          <p className="mt-3 font-mono text-[10px] tracking-[0.35em] uppercase text-[#f0ede6]/25">
            {GREETINGS[idx].lang} · {GREETINGS[idx].script}
          </p>
        </div>

        {/* Scroll hint */}
        <div className="relative z-10 flex items-center gap-3 pb-2">
          <div style={{ width: 1, height: 36, background: "rgba(240,237,230,0.25)" }} />
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-[#f0ede6]/25">scroll</span>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          SECTION 2 — Cream poster (profile + statement)
          One continuous composition, no internal gaps
      ══════════════════════════════════════════════ */}
      <section id="about" ref={posterRef} className="relative overflow-hidden"
        style={{ background: "#F5E6C0", margin: 0, padding: 0 }}>

        {/* ── Bauhaus banner ── */}
        <div style={{ width: "100%", height: "clamp(90px, 13vw, 170px)", overflow: "hidden" }}>
          <img src="/bauhaus-pattern.svg" alt="" aria-hidden="true"
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
        </div>

        {/* ── Portrait + role (grid) ── */}
        <div style={{ position: "relative", height: "clamp(340px, 44vw, 600px)" }}>

          {/* Photo fills right 52% */}
          <div style={{
            position: "absolute", top: 0, right: 0, bottom: 0, width: "52%", overflow: "hidden",
            animation: posterVisible ? "fadeRight 0.7s ease 0.2s both" : "none",
          }}>
            <img src="/profile-picture.png" alt="Mathias Becerra"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 12%", display: "block" }} />
          </div>

          {/* Text left 52% */}
          <div style={{
            position: "absolute", top: 0, left: 0, bottom: 0, width: "52%",
            padding: "clamp(20px, 3.5vw, 52px) clamp(20px, 5vw, 64px)",
            display: "flex", flexDirection: "column", justifyContent: "center",
            gap: "clamp(6px, 1vw, 14px)",
            animation: posterVisible ? "fadeLeft 0.7s ease 0.15s both" : "none",
          }}>
            <img src="/first-screen/ima.svg" alt="I'm a"
              style={{ width: "clamp(100px, 13vw, 190px)", height: "auto", display: "block" }} />

            {/* Role SVGs — crossfade on cycle */}
            <div style={{ position: "relative", width: "clamp(240px, 42vw, 520px)", aspectRatio: "855/427" }}>
              {ROLES.map((role, i) => (
                <img key={role.src} src={role.src} alt={role.label}
                  style={{
                    position: i === 0 ? "relative" : "absolute", top: 0, left: 0,
                    width: "100%", height: "auto", display: "block",
                    opacity: roleIdx === i ? (roleExit ? 0 : 1) : 0,
                    transform: roleIdx === i ? (roleExit ? "translateY(-8px)" : "translateY(0)") : "translateY(8px)",
                    transition: "opacity 0.3s ease, transform 0.3s ease",
                    pointerEvents: roleIdx === i ? "auto" : "none",
                  }} />
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src="/first-screen/from-peru.svg" alt="From Lambayeque, Peru."
                style={{ width: "clamp(110px, 16vw, 220px)", height: "auto", display: "block" }} />
              <img src="/first-screen/peruflag.svg" alt="Peru flag"
                style={{ width: "clamp(20px, 2.5vw, 34px)", height: "auto", display: "block" }} />
            </div>
          </div>
        </div>

        {/* ── Bridge: mid Bauhaus bar (right-aligned, 65% width) ── */}
        <div style={{ display: "flex", justifyContent: "flex-end", overflow: "hidden",
          animation: posterVisible ? "fadeUp 0.6s ease 0.3s both" : "none" }}>
          <img src="/second-screen/word-4.svg" alt="" aria-hidden="true"
            style={{ width: "65%", height: "clamp(70px, 10vw, 130px)", objectFit: "cover", objectPosition: "left center", display: "block" }} />
        </div>

        {/* ── Mission statement ── */}
        <div style={{ position: "relative", padding: "clamp(40px, 6vw, 80px) clamp(40px, 7vw, 120px) clamp(60px, 8vw, 100px)" }}>

          {/* Right accent bar */}
          <img src="/second-screen/word-4.svg" alt="" aria-hidden="true"
            style={{
              position: "absolute", top: 0, right: 0, bottom: 0,
              width: "clamp(24px, 2.5vw, 40px)", height: "100%",
              objectFit: "cover", objectPosition: "right center", display: "block",
            }} />

          <p style={{
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontWeight: 700,
            fontSize: "clamp(28px, 4.5vw, 68px)",
            lineHeight: 1.15,
            color: "#1a1a1a",
            margin: 0,
            maxWidth: "16ch",
            opacity: posterVisible ? 1 : 0,
            transform: posterVisible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.7s ease 0.4s, transform 0.7s ease 0.4s",
          }}>
            {"I "}
            <span key={wordIdx} style={{
              display: "inline-block", color: "#6B1A1A", fontStyle: "italic",
              opacity: wordExit ? 0 : 1,
              transform: wordExit ? "translateY(-10px)" : "translateY(0)",
              transition: "opacity 0.26s ease, transform 0.26s ease",
              animation: !wordExit ? "wordIn 0.36s cubic-bezier(0.22,1,0.36,1) both" : "none",
            }}>
              {WORDS[wordIdx]}
            </span>
            {" products with meticulous attention to detail to create accessible user experiences for social good"}
          </p>
        </div>

        {/* ── Bottom corner clusters ── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <img src="/second-screen/word-2.svg" alt="" aria-hidden="true"
            style={{ width: "clamp(110px, 18vw, 280px)", height: "auto", display: "block" }} />
          <img src="/second-screen/word-3.svg" alt="" aria-hidden="true"
            style={{ width: "clamp(110px, 18vw, 280px)", height: "auto", display: "block" }} />
        </div>
      </section>

      <ThirdScreen />
      <FourthScreen />
      <FifthScreen />
      <SixthScreen />
      <SeventhScreen />
    </div>
  );
}
