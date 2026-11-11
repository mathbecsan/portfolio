"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";

/* ── Interactive Studio room ────────────────────────────────────────────
 * A full-bleed illustrated room that we furnish one asset group at a time.
 *
 * Every asset is positioned in the room artwork's own pixel space
 * (ROOM.w × ROOM.h), so it stays glued to the same spot at any screen size.
 * To add an asset: drop its file(s) in /public/studio/ (content-hashed
 * filename) and add an entry to ASSETS with its x / y / w / h in room pixels.
 *
 *  - Animated assets: `src` is an animated WebP, `still` a single frame. The
 *    still shows instantly; the animation swaps in once downloaded, and is
 *    skipped entirely for visitors who prefer reduced motion.
 *
 * Reachy animation was built from Downloads/reachy_150_transparent_images:
 *   img2webp -loop 0 -mixed -q 82 -m 6 -d 42 reachy_*.png -o reachy-anim.webp   (24 fps)
 */

const ROOM = { w: 1672, h: 941, src: "/studio/room-empty-d65d6a4b.webp", wall: "#FCEEDF" };

type Asset = {
  id: string;
  label: string;          // accessible name
  x: number; y: number;   // top-left, in room pixels
  w: number; h: number;   // size, in room pixels
  src: string;            // image or animated WebP
  still?: string;         // first frame, for instant paint + reduced motion
  float?: boolean;        // gentle hover lift
};

// Reachy Mini stands on the white pedestal between the sofa and the desk.
// Frames are 192×224; drawn at 1.15× with the shadow resting on the pedestal top.
const REACHY_SCALE = 1.15;
const ASSETS: Asset[] = [
  {
    id: "reachy",
    label: "Reachy Mini, the robot, waking up and looking around",
    x: 1112 - 96 * REACHY_SCALE,
    y: 556 - 217 * REACHY_SCALE,
    w: 192 * REACHY_SCALE,
    h: 224 * REACHY_SCALE,
    src: "/studio/reachy-anim-c1966183.webp",
    still: "/studio/reachy-still-5e4e5a38.webp",
    float: true,
  },
];

// Horizontal point (room pixels) the mobile view starts centred on — Reachy for now.
const FOCUS_X = 1112;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

function RoomAsset({ a }: { a: Asset }) {
  const [animReady, setAnimReady] = useState(!a.still);

  useEffect(() => {
    if (!a.still) return;
    let reduce = false;
    try { reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch {}
    if (reduce) return;
    let cancelled = false;
    const img = new Image();
    img.src = a.src;
    img.decode().then(() => { if (!cancelled) setAnimReady(true); }).catch(() => {});
    return () => { cancelled = true; };
  }, [a.src, a.still]);

  const style: CSSProperties = {
    left: pct(a.x, ROOM.w), top: pct(a.y, ROOM.h),
    width: pct(a.w, ROOM.w), height: pct(a.h, ROOM.h),
  };
  return (
    <div className={`studio__asset${a.float ? " studio__asset--float" : ""}`} style={style} data-asset={a.id}>
      <img src={animReady ? a.src : (a.still ?? a.src)} alt={a.label} draggable={false} />
    </div>
  );
}

export default function StudioRoom() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [canPan, setCanPan] = useState(false);

  // On narrow/portrait screens the room is wider than the viewport: start the
  // view centred on the newest asset (FOCUS_X) and let people swipe to explore.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => {
      const overflow = stage.scrollWidth - stage.clientWidth;
      const pans = getComputedStyle(stage).overflowX === "auto" && overflow > 40;
      setCanPan(pans);
      if (pans && stage.scrollLeft === 0) {
        const target = (FOCUS_X / ROOM.w) * stage.scrollWidth - stage.clientWidth / 2;
        stage.scrollLeft = Math.max(0, Math.min(overflow, target));
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return (
    <section className="studio" aria-labelledby="studio-title">
      <style>{`
        .studio { position: relative; margin-top: var(--site-nav-h); height: calc(100svh - var(--site-nav-h)); min-height: 320px; background: ${ROOM.wall}; }
        .studio__stage { position: absolute; inset: 0; overflow: hidden; }
        /* Landscape: cover the stage, centred (may crop a little top/bottom on very wide screens). */
        .studio__scene {
          position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
          width: max(100%, calc((100svh - var(--site-nav-h)) * ${ROOM.w} / ${ROOM.h}));
          aspect-ratio: ${ROOM.w} / ${ROOM.h};
        }
        /* Portrait / narrow (taller than 4:3): keep full height, pan sideways. */
        @media (max-aspect-ratio: 4/3) {
          .studio__stage { overflow-x: auto; overflow-y: hidden; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
          .studio__stage::-webkit-scrollbar { display: none; }
          .studio__scene { left: 0; top: 0; transform: none; height: 100%; width: auto; }
        }
        .studio__room { position: absolute; inset: 0; width: 100%; height: 100%; display: block; user-select: none; }
        .studio__asset { position: absolute; }
        .studio__asset img { width: 100%; height: 100%; display: block; object-fit: contain; user-select: none; -webkit-user-drag: none; }
        .studio__asset--float { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1); transform-origin: 50% 100%; }
        .studio__asset--float:hover { transform: translateY(-2%) scale(1.03); }

        .studio__label {
          position: absolute; z-index: 2; left: var(--gutter); top: clamp(16px, 3vw, 32px); margin: 0; pointer-events: none;
          font-family: var(--font-body); font-weight: 800; font-size: clamp(14px, 1.5vw, 22px);
          letter-spacing: 0.02em; text-transform: uppercase; color: var(--ink);
        }
        .studio__label span { color: var(--bauhaus-red); }
        .studio__hint {
          position: absolute; z-index: 2; left: 50%; bottom: 16px; transform: translateX(-50%); pointer-events: none;
          padding: 6px 14px; border-radius: 999px; background: rgba(13,13,13,0.78); color: var(--cream);
          font-family: var(--font-body); font-size: 12px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
          white-space: nowrap; animation: studioHint 4s ease forwards;
        }
        @keyframes studioHint { 0%, 70% { opacity: 1 } 100% { opacity: 0 } }
      `}</style>

      <h1 id="studio-title" className="studio__label"><span>✦</span> Interactive Studio</h1>

      <div className="studio__stage" ref={stageRef}>
        <div className="studio__scene">
          <img
            className="studio__room"
            src={ROOM.src}
            alt="An illustrated Bauhaus-style studio: a sideboard, a sofa, a coffee table on a rug, a pedestal, a desk and chair, and a window looking out on Stanford's Hoover Tower."
            width={ROOM.w}
            height={ROOM.h}
            fetchPriority="high"
            draggable={false}
          />
          {ASSETS.map((a) => <RoomAsset key={a.id} a={a} />)}
        </div>
      </div>

      {canPan && <p className="studio__hint" aria-hidden="true">← Swipe to explore →</p>}
    </section>
  );
}
