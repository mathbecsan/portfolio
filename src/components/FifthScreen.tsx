"use client";

import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";

const STEPS = [
  {
    num: "01", label: "DISCOVER",  sub: "Research & Empathize",
    body: "Understand users through interviews, contextual inquiry and observation. Map pain points and surface hidden needs.",
    color: "#E63329", hex: 0xE63329,
    tags: ["User Interviews", "Field Research", "Affinity Maps"],
  },
  {
    num: "02", label: "DEFINE",    sub: "Synthesize & Frame",
    body: "Distill findings into personas, journey maps and a sharp problem statement that aligns the entire team.",
    color: "#F5C500", hex: 0xF5C500,
    tags: ["Personas", "Journey Maps", "HMW Statements"],
  },
  {
    num: "03", label: "IDEATE",    sub: "Design & Explore",
    body: "Generate possibilities without judgement. Rapid sketches and Crazy 8s surface the strongest creative directions.",
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

const PANELS = STEPS.length + 1; // intro + 4 steps

export default function FifthScreen() {
  const outerRef  = useRef<HTMLDivElement>(null);  // placeholder for layout space
  const fixedRef  = useRef<HTMLDivElement>(null);  // fixed overlay while hijacking
  const trackRef  = useRef<HTMLDivElement>(null);
  const bgRef     = useRef<HTMLDivElement>(null);
  const barRef    = useRef<HTMLDivElement>(null);
  const stateRef  = useRef({
    active: false,       // are we currently hijacking scroll?
    offset: 0,           // horizontal px offset so far
    maxOffset: 0,        // (PANELS-1) * vw
    lastPanel: -1,
  });

  // ── 1. One shared Three.js fluid background ─────────────────
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

    // Ribbon waves
    const RIBBONS = 24;
    type Rib = { line: THREE.Line; phase: number; speed: number; amp: number; yBase: number };
    const ribbons: Rib[] = [];
    for (let r = 0; r < RIBBONS; r++) {
      const pts: THREE.Vector3[] = [];
      const yBase = (r / RIBBONS - 0.5) * 11;
      for (let s = 0; s <= 120; s++) pts.push(new THREE.Vector3((s / 120 - 0.5) * 20, yBase, 0));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: 0xE63329, transparent: true, opacity: 0.06 + (r % 4) * 0.04 });
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      ribbons.push({ line, phase: r * 0.44, speed: 0.22 + (r % 6) * 0.1, amp: 0.22 + (r % 5) * 0.15, yBase });
    }

    // Particles
    const N = 120;
    const pArr = new Float32Array(N * 3);
    const pVel = new Float32Array(N * 2);
    for (let i = 0; i < N; i++) {
      pArr[i*3]=(Math.random()-.5)*20; pArr[i*3+1]=(Math.random()-.5)*12; pArr[i*3+2]=(Math.random()-.5)*4;
      pVel[i*2]=(Math.random()-.5)*0.006; pVel[i*2+1]=(Math.random()-.5)*0.006;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pArr, 3));
    const pMat = new THREE.PointsMaterial({ color: 0xE63329, size: 0.055, transparent: true, opacity: 0.5 });
    scene.add(new THREE.Points(pGeo, pMat));

    // Color targets
    let tR = 0xE6/255, tG = 0x33/255, tB = 0x29/255;
    let cR = tR, cG = tG, cB = tB;

    // Expose color setter
    (window as any).__s5color = (hex: number) => {
      tR = ((hex >> 16) & 255) / 255;
      tG = ((hex >>  8) & 255) / 255;
      tB = ( hex        & 255) / 255;
    };

    let t = 0, raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      t += 0.009;
      // Lerp color
      cR += (tR - cR) * 0.04; cG += (tG - cG) * 0.04; cB += (tB - cB) * 0.04;
      const col = new THREE.Color(cR, cG, cB);
      pMat.color.copy(col);
      ribbons.forEach(({ line }) => (line.material as THREE.LineBasicMaterial).color.copy(col));

      ribbons.forEach(({ line, phase, speed, amp, yBase }) => {
        const arr = line.geometry.attributes.position.array as Float32Array;
        for (let s = 0; s <= 120; s++) {
          arr[s*3+1] = yBase
            + amp * Math.sin(arr[s*3] * 0.32 + t * speed + phase)
            + amp * 0.5 * Math.sin(arr[s*3] * 0.66 + t * speed * 1.5 + phase * 2);
        }
        line.geometry.attributes.position.needsUpdate = true;
      });

      for (let i = 0; i < N; i++) {
        pArr[i*3]   += pVel[i*2];   if (Math.abs(pArr[i*3])   > 10)  pVel[i*2]   *= -1;
        pArr[i*3+1] += pVel[i*2+1]; if (Math.abs(pArr[i*3+1]) > 6)   pVel[i*2+1] *= -1;
      }
      pGeo.attributes.position.needsUpdate = true;
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
      window.removeEventListener("resize", onResize);
      delete (window as any).__s5color;
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  // ── Helper: update visuals for a given progress (0→1) ───────
  const applyProgress = useCallback((progress: number) => {
    const track = trackRef.current;
    const bar   = barRef.current;
    const s     = stateRef.current;
    if (!track || !bar) return;

    const panelF = progress * (PANELS - 1);
    const panel  = Math.min(Math.floor(panelF), PANELS - 1);

    // Move horizontal track
    track.style.transform = `translateX(${-panelF * 100}vw)`;

    // Progress bar
    bar.style.width = `${progress * 100}%`;

    // Active panel color + panel content visibility
    if (panel !== s.lastPanel) {
      s.lastPanel = panel;
      const step = STEPS[panel - 1];
      if ((window as any).__s5color) {
        if (step) (window as any).__s5color(step.hex);
        else (window as any).__s5color(0xf0ede6);
      }
      // Update progress bar color
      if (bar && step) bar.style.background = step.color;

      // Fade panels in/out
      track.querySelectorAll<HTMLElement>(".s5p").forEach((el, i) => {
        const isActive = i === panel;
        const isPast   = i < panel;
        el.style.opacity = isActive ? "1" : isPast ? "0.3" : "0.12";
        const content = el.querySelector<HTMLElement>(".s5c");
        if (content) {
          content.style.opacity   = isActive ? "1"  : isPast ? "0.3" : "0";
          content.style.transform = isActive ? "translateX(0)" : isPast ? "translateX(-52px)" : "translateX(68px)";
        }
      });
    }
  }, []);

  // ── 2. Scroll-hijack via wheel events ────────────────────────
  useEffect(() => {
    const outer   = outerRef.current;
    const fixed   = fixedRef.current;
    if (!outer || !fixed) return;

    const s = stateRef.current;

    const engage = () => {
      if (s.active) return;
      s.active = true;
      s.maxOffset = (PANELS - 1) * window.innerWidth;
      // Show fixed overlay aligned with outer placeholder
      fixed.style.display = "block";
      // Freeze body scroll at outer's position
      document.body.style.overflow = "hidden";
    };

    const disengage = (scrollToTop = false) => {
      if (!s.active) return;
      s.active = false;
      fixed.style.display = "none";
      document.body.style.overflow = "";
      if (scrollToTop) {
        // jump body scroll to just ABOVE outer so normal scroll resumes
        window.scrollTo({ top: outer.getBoundingClientRect().top + window.scrollY - 4 });
      } else {
        // jump body scroll to just BELOW outer
        window.scrollTo({ top: outer.getBoundingClientRect().bottom + window.scrollY + 4 });
      }
    };

    const onWheel = (e: WheelEvent) => {
      const rect = outer.getBoundingClientRect();
      const inZone = rect.top <= 30 && rect.top >= -30;

      // Snap into hijack when entering from above
      if (!s.active && e.deltaY > 0 && rect.top > -60 && rect.top < window.innerHeight * 0.5) {
        window.scrollTo({ top: outer.getBoundingClientRect().top + window.scrollY });
        engage();
      }

      if (!s.active) return;

      e.preventDefault();
      e.stopPropagation();

      const delta = e.deltaY * 2.2;
      const next  = Math.max(0, Math.min(s.maxOffset, s.offset + delta));

      if (delta < 0 && s.offset <= 0) {
        // Scroll back up past section
        disengage(true);
        return;
      }
      if (delta > 0 && s.offset >= s.maxOffset) {
        // Scroll forward past section
        disengage(false);
        return;
      }

      s.offset = next;
      applyProgress(s.offset / s.maxOffset);
    };

    // Touch support
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => { touchY = e.touches[0].clientY; };
    const onTouchMove  = (e: TouchEvent) => {
      if (!s.active) return;
      e.preventDefault();
      const dy = touchY - e.touches[0].clientY;
      touchY = e.touches[0].clientY;
      const next = Math.max(0, Math.min(s.maxOffset, s.offset + dy * 2.5));
      if (dy < 0 && s.offset <= 0)    { disengage(true);  return; }
      if (dy > 0 && s.offset >= s.maxOffset) { disengage(false); return; }
      s.offset = next;
      applyProgress(s.offset / s.maxOffset);
    };

    document.addEventListener("wheel",      onWheel,      { passive: false, capture: true });
    document.addEventListener("touchstart", onTouchStart, { passive: true  });
    document.addEventListener("touchmove",  onTouchMove,  { passive: false });

    return () => {
      document.removeEventListener("wheel",      onWheel,      true);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove",  onTouchMove);
      document.body.style.overflow = "";
    };
  }, [applyProgress]);

  return (
    <>
      {/* Placeholder that triggers the hijack */}
      <div ref={outerRef} style={{ height: "100vh", background: "#080808" }} />

      {/* Fixed overlay — shown only while hijack is active */}
      <div ref={fixedRef} style={{
        display: "none",
        position: "fixed", inset: 0, zIndex: 999,
        background: "#080808", overflow: "hidden",
      }}>
        <style>{`
          .s5c { transition: opacity .45s cubic-bezier(.22,1,.36,1), transform .45s cubic-bezier(.22,1,.36,1); }
          .s5-tag { font-family:monospace; font-size:clamp(9px,.85vw,11px); letter-spacing:.1em; color:rgba(240,237,230,.45); border:1px solid rgba(240,237,230,.18); padding:3px 10px; border-radius:3px; white-space:nowrap; }
        `}</style>

        {/* Three.js fluid background */}
        <div ref={bgRef} style={{ position:"absolute", inset:0, zIndex:0 }} />

        {/* Horizontal track */}
        <div ref={trackRef}
          style={{
            position:"absolute", inset:0,
            display:"flex", width:`${PANELS * 100}vw`,
            transform:"translateX(0)", willChange:"transform",
            zIndex:1,
          }}
        >
          {/* ── Panel 0: Intro ── */}
          <div className="s5p" style={{ width:"100vw", height:"100vh", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", opacity:1 }}>
            <div className="s5c" style={{ textAlign:"center", opacity:1, transform:"translateX(0)" }}>
              <p style={{ fontFamily:"monospace", fontSize:"clamp(9px,.9vw,12px)", letterSpacing:".28em", color:"rgba(240,237,230,.3)", textTransform:"uppercase", margin:"0 0 14px" }}>
                UX Research & Design
              </p>
              <h2 style={{ fontFamily:"monospace", fontWeight:900, fontSize:"clamp(52px,9.5vw,128px)", color:"#f0ede6", margin:0, letterSpacing:"-.02em", lineHeight:.88 }}>
                THE<br/>PROCESS
              </h2>
              <p style={{ fontFamily:"monospace", fontSize:"clamp(9px,.85vw,11px)", letterSpacing:".24em", color:"rgba(240,237,230,.22)", margin:"32px 0 0", textTransform:"uppercase" }}>
                Scroll to reveal ↓
              </p>
              <div style={{ display:"flex", gap:20, marginTop:44, justifyContent:"center" }}>
                {STEPS.map(s => (
                  <span key={s.num} style={{ fontFamily:"monospace", fontSize:10, color:s.color, letterSpacing:".12em", borderBottom:`2px solid ${s.color}`, paddingBottom:2 }}>
                    {s.num} {s.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Panels 1-4 ── */}
          {STEPS.map((step, i) => (
            <div key={step.num} className="s5p"
              style={{ width:"100vw", height:"100vh", flexShrink:0, display:"flex", alignItems:"center", padding:"0 clamp(40px,8vw,130px)", position:"relative", opacity:"0.12" }}
            >
              {/* Colored left bar */}
              <div style={{ position:"absolute", left:0, top:"12%", bottom:"12%", width:3, background:step.color, borderRadius:2 }} />

              <div className="s5c"
                style={{ maxWidth:680, opacity:"0", transform:"translateX(68px)" }}
              >
                <p style={{ fontFamily:"monospace", fontWeight:700, fontSize:"clamp(10px,1.1vw,13px)", color:step.color, letterSpacing:".2em", margin:"0 0 10px", textTransform:"uppercase" }}>
                  Step {step.num} / {STEPS.length}
                </p>
                <h3 style={{ fontFamily:"monospace", fontWeight:900, fontSize:"clamp(46px,9vw,118px)", color:"#f0ede6", margin:"0 0 4px", lineHeight:.88, letterSpacing:"-.02em" }}>
                  {step.label}
                </h3>
                <p style={{ fontFamily:"Georgia,serif", fontStyle:"italic", fontSize:"clamp(14px,1.8vw,23px)", color:step.color, margin:"0 0 18px" }}>
                  {step.sub}
                </p>
                <div style={{ width:"clamp(36px,4.5vw,60px)", height:2, background:step.color, borderRadius:1, marginBottom:18 }} />
                <p style={{ fontFamily:"Georgia,serif", fontSize:"clamp(14px,1.3vw,18px)", color:"rgba(240,237,230,.68)", lineHeight:1.72, margin:"0 0 22px", maxWidth:500 }}>
                  {step.body}
                </p>
                <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                  {step.tags.map(tag => <span key={tag} className="s5-tag">{tag}</span>)}
                </div>
              </div>

              {/* Dot nav */}
              <div style={{ position:"absolute", right:"clamp(24px,4vw,56px)", top:"50%", transform:"translateY(-50%)", display:"flex", flexDirection:"column", gap:10 }}>
                {STEPS.map((s2, di) => (
                  <div key={di} style={{ width:6, height: di===i ? 22 : 6, borderRadius:4, background: di===i ? s2.color : "rgba(255,255,255,.18)", transition:"all .4s ease" }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom progress bar */}
        <div style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:"rgba(255,255,255,.06)", zIndex:10 }}>
          <div ref={barRef} style={{ height:"100%", width:"0%", background:"#E63329", transition:"background .4s ease" }} />
        </div>
      </div>
    </>
  );
}
