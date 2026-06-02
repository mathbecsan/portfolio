"use client";

import { useEffect, useRef, useState } from "react";

interface IntroAnimationProps {
  onComplete: () => void;
}

const CREAM = "#f0ede6";
const RED   = "#E63329";
const BLUE  = "#2952A3";
const GOLD  = "#F5A623";
const BLACK = "#111111";

// ── MATHBECSAN SVG letterforms ─────────────────────────────────
function LogoSVG({ visible, accentsIn }: { visible: boolean[]; accentsIn: boolean }) {
  const letters = [
    { x: 0,    w: 120, body: <>
        <rect x="0" y="0" width="22" height="110" fill={CREAM}/>
        <polygon points="22,0 44,0 66,110 44,110" fill={CREAM}/>
        <polygon points="76,0 98,0 76,110 54,110" fill={CREAM}/>
        <rect x="98" y="0" width="22" height="110" fill={CREAM}/>
      </>, accent: <polygon points="44,0 76,0 60,32" fill={RED}/>
    },
    { x: 130,  w: 108, body: <polygon points="54,0 108,110 0,110" fill={CREAM}/>, accent: null },
    { x: 250,  w: 112, body: <>
        <rect x="0"  y="0" width="112" height="24" fill={BLUE}/>
        <rect x="45" y="24" width="22" height="86" fill={CREAM}/>
      </>, accent: null
    },
    { x: 374,  w: 110, body: <>
        <rect x="0"  y="0" width="22" height="110" fill={CREAM}/>
        <rect x="88" y="0" width="22" height="110" fill={CREAM}/>
        <rect x="22" y="44" width="66" height="22" fill={CREAM}/>
      </>, accent: <rect x="30" y="44" width="50" height="50" fill={GOLD}/>
    },
    { x: 496,  w: 110, body: <>
        <rect x="0" y="0" width="22" height="110" fill={CREAM}/>
        <rect x="22" y="2"  width="56" height="52" fill={BLUE}/>
        <ellipse cx="78" cy="28" rx="24" ry="26" fill={BLUE}/>
        <rect x="22" y="58" width="64" height="50" fill={BLUE}/>
        <ellipse cx="86" cy="83" rx="24" ry="25" fill={BLUE}/>
        <rect x="20" y="52" width="90" height="7" fill={CREAM}/>
      </>, accent: null
    },
    { x: 618,  w: 100, body: <>
        <rect x="0"  y="0"  width="22" height="110" fill={CREAM}/>
        <rect x="22" y="0"  width="78" height="22"  fill={CREAM}/>
        <rect x="22" y="44" width="58" height="22"  fill={CREAM}/>
        <rect x="22" y="88" width="78" height="22"  fill={CREAM}/>
      </>, accent: null
    },
    { x: 730,  w: 108, body: <>
        <rect x="0"  y="0"  width="22" height="110" fill={CREAM}/>
        <rect x="22" y="0"  width="86" height="22"  fill={CREAM}/>
        <rect x="22" y="88" width="86" height="22"  fill={CREAM}/>
      </>, accent: <circle cx="72" cy="55" r="22" fill={GOLD}/>
    },
    { x: 850,  w: 106, body: <>
        {/* blue top D — opens right */}
        <rect x="8"  y="0"  width="58" height="52" fill={BLUE}/>
        <ellipse cx="66" cy="26" rx="28" ry="26" fill={BLUE}/>
        {/* red bottom D — opens left */}
        <rect x="40" y="58" width="58" height="52" fill={RED}/>
        <ellipse cx="40" cy="84" rx="28" ry="26" fill={RED}/>
        <rect x="0" y="51" width="106" height="7" fill="#0a0a0a"/>
      </>, accent: null
    },
    { x: 968,  w: 108, body: <polygon points="54,0 108,110 0,110" fill={CREAM}/>, accent: null },
    { x: 1088, w: 130, body: <>
        <rect x="0"   y="0" width="22" height="110" fill={CREAM}/>
        <polygon points="22,0 44,0 90,110 68,110" fill={CREAM}/>
        <rect x="90"  y="0" width="24" height="110" fill={CREAM}/>
        <rect x="114" y="0" width="12" height="110" fill={GOLD}/>
        <rect x="126" y="0" width="4"  height="110" fill={BLACK}/>
      </>, accent: null
    },
  ];

  return (
    <svg
      viewBox="0 0 1218 110"
      style={{ width: "min(90vw, 1000px)", height: "auto", display: "block", overflow: "visible" }}
    >
      {letters.map((l, i) => (
        <g key={i} transform={`translate(${l.x}, 0)`}>
          {/* clip each letter in its own overflow:hidden lane */}
          <clipPath id={`lc${i}`}>
            <rect x="0" y="-10" width={l.w} height="130"/>
          </clipPath>
          <g clipPath={`url(#lc${i})`}>
            <g style={{
              transform: visible[i] ? "translateY(0px)" : "translateY(130px)",
              transition: visible[i]
                ? `transform 0.55s cubic-bezier(0.22,1,0.36,1) ${i * 45}ms`
                : "none",
            }}>
              {l.body}
              {l.accent && (
                <g style={{
                  transformOrigin: `${l.w / 2}px 55px`,
                  transform: accentsIn ? "scale(1)" : "scale(0.2)",
                  opacity: accentsIn ? 1 : 0,
                  transition: accentsIn
                    ? `transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i * 30}ms,
                       opacity 0.3s ease ${i * 30}ms`
                    : "none",
                }}>
                  {l.accent}
                </g>
              )}
            </g>
          </g>
        </g>
      ))}
    </svg>
  );
}

// ── Main component ─────────────────────────────────────────────
export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [gridIn,     setGridIn]     = useState(false);
  const [shapesIn,   setShapesIn]   = useState(false);
  const [logoStart,  setLogoStart]  = useState(false);
  const [lettersIn,  setLettersIn]  = useState<boolean[]>(new Array(10).fill(false));
  const [accentsIn,  setAccentsIn]  = useState(false);
  const [exiting,    setExiting]    = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const add = (fn: () => void, ms: number) =>
      timers.current.push(setTimeout(fn, ms));

    // Phase 1 — grid + shapes (0–3 000 ms)
    add(() => setGridIn(true),   100);
    add(() => setShapesIn(true), 400);

    // Phase 2 — logo assembles (3 000–5 000 ms)
    add(() => setLogoStart(true), 3000);
    for (let i = 0; i < 10; i++) {
      add(() => setLettersIn(prev => {
        const next = [...prev];
        next[i] = true;
        return next;
      }), 3000 + i * 55);
    }
    add(() => setAccentsIn(true), 3000 + 10 * 55 + 80);

    // Phase 3 — exit (5 200 ms)
    add(() => setExiting(true), 5200);
    add(() => onComplete(),     6100);

    return () => timers.current.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 40,
      background: "#0a0a0a", overflow: "hidden",
      opacity: exiting ? 0 : 1,
      transform: exiting ? "scale(1.06)" : "scale(1)",
      transition: exiting ? "opacity 0.9s ease, transform 0.9s cubic-bezier(0.4,0,0.2,1)" : "none",
    }}>

      {/* ── Grid ─────────────────────────────────────────────── */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage:
          "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)," +
          "linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
        backgroundSize: "70px 70px",
        opacity: gridIn ? 1 : 0,
        transition: "opacity 0.9s ease",
      }}/>

      {/* ── Animated dots ───────────────────────────────────── */}
      {gridIn && (
        <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}}>
          <style>{`
            @keyframes dropD { 0%{opacity:0;transform:translateY(-50px)} 15%{opacity:1} 85%{opacity:1} 100%{opacity:0;transform:translateY(90px)} }
            @keyframes slideR { 0%{opacity:0;transform:translateX(-50px)} 15%{opacity:1} 85%{opacity:1} 100%{opacity:0;transform:translateX(120px)} }
          `}</style>
          {[14,27,41,54,63,72].map((x,i) => (
            <circle key={`d${i}`} cx={`${x}%`} cy={`${12+i*10}%`} r="3" fill="#fff"
              style={{animation:`dropD ${2.2+i*0.15}s ${i*0.12}s ease-in-out infinite`}}/>
          ))}
          {[17,33,50,64,74].map((y,i) => (
            <circle key={`r${i}`} cx={`${18+i*10}%`} cy={`${y}%`} r="3" fill="#fff"
              style={{animation:`slideR ${2.5+i*0.2}s ${i*0.18}s ease-in-out infinite`}}/>
          ))}
        </svg>
      )}

      {/* ── Corner shapes ───────────────────────────────────── */}
      {/* Yellow triangle — top left */}
      <div style={{
        position:"absolute",
        top: shapesIn ? "7%" : "-15%",
        left: shapesIn ? "2%" : "-8%",
        width:0, height:0, borderStyle:"solid",
        borderWidth:"52px 0 52px 90px",
        borderColor:`transparent transparent transparent ${GOLD}`,
        transition:"top 1.0s cubic-bezier(0.16,1,0.3,1) 0.1s, left 1.0s cubic-bezier(0.16,1,0.3,1) 0.1s",
        opacity: shapesIn ? 1 : 0,
        transitionProperty:"top,left,opacity",
      }}/>
      {/* Red circle — top right */}
      <div style={{
        position:"absolute",
        width:"clamp(140px,17vw,250px)", height:"clamp(140px,17vw,250px)",
        borderRadius:"50%", background:RED,
        top: shapesIn ? "2%" : "-25%",
        right: shapesIn ? "1%" : "-10%",
        opacity: shapesIn ? 1 : 0,
        transition:"top 1.0s cubic-bezier(0.16,1,0.3,1) 0.2s, right 1.0s cubic-bezier(0.16,1,0.3,1) 0.2s, opacity 0.6s ease 0.2s",
      }}/>
      {/* Blue circle — bottom left */}
      <div style={{
        position:"absolute",
        width:"clamp(155px,19vw,280px)", height:"clamp(155px,19vw,280px)",
        borderRadius:"50%", background:BLUE,
        bottom: shapesIn ? "2%" : "-25%",
        left: shapesIn ? "1%" : "-10%",
        opacity: shapesIn ? 1 : 0,
        transition:"bottom 1.0s cubic-bezier(0.16,1,0.3,1) 0.15s, left 1.0s cubic-bezier(0.16,1,0.3,1) 0.15s, opacity 0.6s ease 0.15s",
      }}/>
      {/* Yellow triangle — bottom right */}
      <div style={{
        position:"absolute",
        bottom: shapesIn ? "6%" : "-15%",
        right: shapesIn ? "2%" : "-8%",
        width:0, height:0, borderStyle:"solid",
        borderWidth:"48px 0 48px 83px",
        borderColor:`transparent transparent transparent ${GOLD}`,
        transform:"scaleX(-1)",
        opacity: shapesIn ? 1 : 0,
        transition:"bottom 1.0s cubic-bezier(0.16,1,0.3,1) 0.05s, right 1.0s cubic-bezier(0.16,1,0.3,1) 0.05s, opacity 0.6s ease 0.05s",
      }}/>

      {/* ── MATHBECSAN logo — center ─────────────────────────── */}
      <div style={{
        position:"absolute", inset:0,
        display:"flex", alignItems:"center", justifyContent:"center",
        pointerEvents:"none",
        opacity: logoStart ? 1 : 0,
        transition:"opacity 0.3s ease",
      }}>
        <LogoSVG visible={lettersIn} accentsIn={accentsIn}/>
      </div>

    </div>
  );
}
