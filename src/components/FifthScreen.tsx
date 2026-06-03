"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

const STEPS = [
  {
    num: "01", label: "DISCOVER",  sub: "Research & Empathize",
    body: "Understand users through interviews, observations and contextual inquiry. Map pain points and surface hidden needs.",
    color: "#E63329", hex: 0xE63329,
    tags: ["User Interviews", "Field Research", "Affinity Maps"],
  },
  {
    num: "02", label: "DEFINE",    sub: "Synthesize & Frame",
    body: "Distill findings into personas, journey maps and a sharp problem statement that gives the whole team direction.",
    color: "#F5C500", hex: 0xF5C500,
    tags: ["Personas", "Journey Maps", "HMW Statements"],
  },
  {
    num: "03", label: "IDEATE",    sub: "Design & Explore",
    body: "Generate possibilities without judgement. Rapid sketches, Crazy 8s and card-sorting surface the strongest directions.",
    color: "#1B3F8B", hex: 0x1B3F8B,
    tags: ["Sketching", "Crazy 8s", "Storyboards"],
  },
  {
    num: "04", label: "ITERATE",   sub: "Prototype & Test",
    body: "Build the lightest prototype that answers the key question. Put it in front of users, learn fast and loop again.",
    color: "#2A9D8F", hex: 0x2A9D8F,
    tags: ["Wireframes", "Prototypes", "Usability Tests"],
  },
];

// panels: 0 = intro, 1-4 = steps
const PANELS = STEPS.length + 1;
// scroll space: PANELS × 100vh
const SCROLL_VH = PANELS * 100;

export default function FifthScreen() {
  const wrapRef   = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const trackRef  = useRef<HTMLDivElement>(null);
  const bgRef     = useRef<HTMLDivElement>(null);
  const barRef    = useRef<HTMLDivElement>(null);

  // ── Three.js single shared background ─────────────────────
  useEffect(() => {
    const mount = bgRef.current;
    if (!mount) return;
    const W = mount.clientWidth, H = mount.clientHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(W, H);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 100);
    camera.position.z = 7;
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    // ── Ribbon field ───────────────────────────────────────
    const RIBBONS = 22;
    type Ribbon = { line: THREE.Line; phase: number; speed: number; amp: number; yBase: number };
    const ribbons: Ribbon[] = [];

    for (let r = 0; r < RIBBONS; r++) {
      const pts: THREE.Vector3[] = [];
      const segs = 100;
      const yBase = (r / RIBBONS - 0.5) * 10;
      for (let s = 0; s <= segs; s++)
        pts.push(new THREE.Vector3((s / segs - 0.5) * 18, yBase, 0));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: 0xE63329, transparent: true, opacity: 0.08 + (r % 4) * 0.04 });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      ribbons.push({ line, phase: r * 0.42, speed: 0.25 + (r % 5) * 0.1, amp: 0.25 + (r % 4) * 0.14, yBase });
    }

    // ── Particle cloud ─────────────────────────────────────
    const N = 100;
    const pArr = new Float32Array(N * 3);
    const pVel = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      pArr[i*3]   = (Math.random()-0.5)*18; pArr[i*3+1] = (Math.random()-0.5)*11; pArr[i*3+2] = (Math.random()-0.5)*4;
      pVel[i*3]   = (Math.random()-0.5)*0.005; pVel[i*3+1] = (Math.random()-0.5)*0.005;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xE63329, size: 0.06, transparent: true, opacity: 0.55 });
    const pts3d = new THREE.Points(pGeo, pMat);
    scene.add(pts3d);

    // target color for smooth transitions
    let targetR = 0xE6/255, targetG = 0x33/255, targetB = 0x29/255;
    let curR    = targetR,  curG    = targetG,  curB    = targetB;

    // exposed so scroll handler can update
    (window as any).__s5SetColor = (hex: number) => {
      targetR = ((hex >> 16) & 255) / 255;
      targetG = ((hex >>  8) & 255) / 255;
      targetB = ( hex        & 255) / 255;
    };

    let t = 0, raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.010;

      // Lerp color
      curR += (targetR - curR) * 0.035;
      curG += (targetG - curG) * 0.035;
      curB += (targetB - curB) * 0.035;
      const col = new THREE.Color(curR, curG, curB);
      pMat.color.copy(col);
      ribbons.forEach(({ line }) => (line.material as THREE.LineBasicMaterial).color.copy(col));

      // Animate ribbons
      ribbons.forEach(({ line, phase, speed, amp, yBase }) => {
        const arr = line.geometry.attributes.position.array as Float32Array;
        for (let s = 0; s <= 100; s++) {
          arr[s*3+1] = yBase
            + amp * Math.sin(arr[s*3] * 0.35 + t * speed + phase)
            + amp * 0.45 * Math.sin(arr[s*3] * 0.7 + t * speed * 1.6 + phase * 1.8);
        }
        line.geometry.attributes.position.needsUpdate = true;
      });

      // Move particles
      for (let i = 0; i < N; i++) {
        pArr[i*3]   += pVel[i*3];   if (Math.abs(pArr[i*3])   > 9)   pVel[i*3]   *= -1;
        pArr[i*3+1] += pVel[i*3+1]; if (Math.abs(pArr[i*3+1]) > 5.5) pVel[i*3+1] *= -1;
      }
      pGeo.attributes.position.needsUpdate = true;

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
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      delete (window as any).__s5SetColor;
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  // ── Scroll → horizontal translation (direct DOM) ───────────
  useEffect(() => {
    const wrap   = wrapRef.current;
    const track  = trackRef.current;
    const bar    = barRef.current;
    if (!wrap || !track || !bar) return;

    let lastPanel = -1;

    const onScroll = () => {
      const rect  = wrap.getBoundingClientRect();
      const total = wrap.offsetHeight - window.innerHeight;
      if (total <= 0) return;

      const progress = Math.max(0, Math.min(1, -rect.top / total));
      const panelF   = progress * (PANELS - 1);  // 0 → 4
      const panel    = Math.min(Math.floor(panelF), PANELS - 1);

      // Move track horizontally
      track.style.transform = `translateX(${-panelF * 100}vw)`;

      // Update progress bar
      bar.style.width = `${progress * 100}%`;

      // Update Three.js color when panel changes
      if (panel !== lastPanel) {
        lastPanel = panel;
        const step = STEPS[panel - 1];
        if (step && (window as any).__s5SetColor) (window as any).__s5SetColor(step.hex);
        else if (panel === 0 && (window as any).__s5SetColor) (window as any).__s5SetColor(0xf0ede6);

        // Highlight active step panel
        track.querySelectorAll<HTMLElement>(".s5-panel").forEach((el, i) => {
          if (i === 0) return; // skip intro
          const active = i === panel;
          const past   = i < panel;
          el.style.opacity = active ? "1" : past ? "0.35" : "0.18";
          (el.querySelector(".s5-content") as HTMLElement | null)?.style &&
            Object.assign((el.querySelector(".s5-content") as HTMLElement).style, {
              opacity:   active ? "1"             : past ? "0.4" : "0",
              transform: active ? "translateX(0)" : past ? "translateX(-48px)" : "translateX(64px)",
            });
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // init
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={wrapRef} style={{ height: `${SCROLL_VH}vh`, position: "relative" }}>
      <style>{`
        .s5-content { transition: opacity 0.5s cubic-bezier(0.22,1,0.36,1), transform 0.5s cubic-bezier(0.22,1,0.36,1); }
        .s5-tag { font-family:monospace; font-size:clamp(9px,.85vw,11px); letter-spacing:.1em; color:rgba(240,237,230,.5); border:1px solid rgba(240,237,230,.2); padding:4px 10px; border-radius:3px; white-space:nowrap; }
        .s5-divider { transition: width .7s cubic-bezier(0.22,1,0.36,1) .15s; }
      `}</style>

      {/* ── Sticky viewport ── */}
      <div ref={stickyRef} style={{ position:"sticky", top:0, height:"100vh", overflow:"hidden", background:"#080808" }}>

        {/* One shared Three.js background */}
        <div ref={bgRef} style={{ position:"absolute", inset:0, zIndex:0 }} />

        {/* Horizontal track */}
        <div ref={trackRef}
          style={{
            display:"flex", width:`${PANELS * 100}vw`, height:"100%",
            position:"relative", zIndex:1,
            transition:"transform 0.04s linear", willChange:"transform",
          }}
        >
          {/* ── Panel 0: Intro ── */}
          <div className="s5-panel" style={{ width:"100vw", height:"100%", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:0 }}>
            <p style={{ fontFamily:"monospace", fontSize:"clamp(10px,1vw,12px)", letterSpacing:".26em", color:"rgba(240,237,230,.3)", textTransform:"uppercase", margin:"0 0 16px" }}>
              UX Research & Design
            </p>
            <h2 style={{ fontFamily:"monospace", fontWeight:900, fontSize:"clamp(48px,9vw,120px)", color:"#f0ede6", margin:0, letterSpacing:"-.02em", lineHeight:.92, textAlign:"center" }}>
              THE<br/>PROCESS
            </h2>
            <p style={{ fontFamily:"monospace", fontSize:"clamp(9px,.9vw,12px)", letterSpacing:".22em", color:"rgba(240,237,230,.25)", margin:"36px 0 0", textTransform:"uppercase" }}>
              Scroll to reveal ↓
            </p>
            {/* Step pills */}
            <div style={{ display:"flex", gap:16, marginTop:48 }}>
              {STEPS.map(s => (
                <span key={s.num} style={{ fontFamily:"monospace", fontSize:11, color:s.color, letterSpacing:".1em", borderBottom:`2px solid ${s.color}`, paddingBottom:3 }}>
                  {s.num} {s.label}
                </span>
              ))}
            </div>
          </div>

          {/* ── Panels 1-4: Steps ── */}
          {STEPS.map((step, i) => (
            <div key={step.num} className="s5-panel"
              style={{
                width:"100vw", height:"100%", flexShrink:0,
                display:"flex", alignItems:"center",
                padding:"0 clamp(40px,8vw,130px)",
                opacity: i === 0 ? "1" : "0.18",
              }}
            >
              {/* Left accent */}
              <div style={{ position:"absolute", left:0, top:"12%", bottom:"12%", width:3, background:step.color, borderRadius:2 }} />

              <div className="s5-content"
                style={{
                  maxWidth:680, opacity:i === 0 ? "1" : "0",
                  transform: i === 0 ? "translateX(0)" : "translateX(64px)",
                }}
              >
                <p style={{ fontFamily:"monospace", fontWeight:700, fontSize:"clamp(10px,1.1vw,13px)", color:step.color, letterSpacing:".2em", margin:"0 0 10px", textTransform:"uppercase" }}>
                  Step {step.num} / {STEPS.length}
                </p>
                <h3 style={{ fontFamily:"monospace", fontWeight:900, fontSize:"clamp(44px,8.5vw,112px)", color:"#f0ede6", margin:"0 0 6px", lineHeight:.9, letterSpacing:"-.02em" }}>
                  {step.label}
                </h3>
                <p style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:"clamp(14px,1.7vw,22px)", color:step.color, margin:"0 0 20px" }}>
                  {step.sub}
                </p>
                <div className="s5-divider" style={{ height:2, background:step.color, borderRadius:1, marginBottom:20, width: i === 0 ? "clamp(40px,5vw,70px)" : 0 }} />
                <p style={{ fontFamily:"Georgia,serif", fontSize:"clamp(14px,1.35vw,18px)", color:"rgba(240,237,230,.7)", lineHeight:1.72, margin:"0 0 24px", maxWidth:500 }}>
                  {step.body}
                </p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {step.tags.map(t => <span key={t} className="s5-tag">{t}</span>)}
                </div>
              </div>

              {/* Step dots nav */}
              <div style={{ position:"absolute", right:"clamp(24px,4vw,56px)", top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:10 }}>
                {STEPS.map((s, di) => (
                  <div key={di} style={{ width:7, height: di === i ? 22 : 7, borderRadius:4, background: di === i ? s.color : "rgba(255,255,255,.18)", transition:"all .4s ease" }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"rgba(255,255,255,.07)", zIndex:10 }}>
          <div ref={barRef} style={{ height:"100%", background:"#E63329", width:"0%", transition:"background .4s ease" }} />
        </div>
      </div>
    </div>
  );
}
