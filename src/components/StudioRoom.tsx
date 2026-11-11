"use client";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties } from "react";

/* ── Interactive Studio room ────────────────────────────────────────────
 * A full-bleed illustrated room that we furnish one asset group at a time.
 *
 * Every asset is positioned in the room artwork's own pixel space
 * (ROOM.w × ROOM.h), so it stays glued to the same spot at any screen size.
 * To add an asset: drop its file(s) in /public/studio/ (content-hashed
 * filename) and add an entry to ASSETS with its x / y / w / h in room pixels.
 *
 *  - `src` is the idle image or looping animated WebP; `still` (optional) is a
 *    single frame that paints instantly and is used for reduced motion.
 *  - `action` (optional) makes the asset a button: clicking plays the action
 *    animation once, then returns to idle.
 *
 * Reachy clips were built from Downloads/reachy_150_transparent_images
 * (frames 1–14 asleep, 15–121 awake/dancing, 122–135 dozing off again):
 *   sleep: frames 1–7,10–12 ping-pong   img2webp -loop 0 -mixed -q 82 -m 6 -d 90 …
 *   dance: frames 13–135, played once   img2webp -loop 1 -mixed -q 82 -m 6 -d 42 …   (24 fps)
 */

const ROOM = { w: 1672, h: 941, src: "/studio/room-empty-d65d6a4b.webp", wall: "#FCEEDF" };

type Action = {
  src: string;            // one-shot animated WebP
  durationMs: number;     // frames × frame delay
  still?: string;         // shown instead of the animation for reduced motion
  cta: string;            // accessible hint read by screen readers, e.g. "Wake me up!"
};

type Asset = {
  id: string;
  label: string;          // accessible name
  x: number; y: number;   // top-left, in room pixels
  w: number; h: number;   // size, in room pixels
  src: string;            // idle image or looping animated WebP
  still?: string;         // first idle frame, for instant paint + reduced motion
  action?: Action;
  sleepy?: boolean;       // show floating "z z z" while idle
};

// Reachy Mini stands on the white pedestal between the sofa and the desk.
// Frames are 192×224; drawn at 1.15× with the shadow resting on the pedestal top.
const REACHY_SCALE = 1.15;
const ASSETS: Asset[] = [
  {
    id: "reachy",
    label: "Reachy Mini, the robot",
    x: 1112 - 96 * REACHY_SCALE,
    y: 556 - 217 * REACHY_SCALE,
    w: 192 * REACHY_SCALE,
    h: 224 * REACHY_SCALE,
    src: "/studio/reachy-sleep-c5b692d6.webp",
    still: "/studio/reachy-still-5e4e5a38.webp",
    sleepy: true,
    action: {
      src: "/studio/reachy-dance-073d30a4.webp",
      durationMs: 123 * 42,
      still: "/studio/reachy-awake-36123216.webp",
      cta: "Wake me up!",
    },
  },
];

// Horizontal point (room pixels) the mobile view starts centred on — Reachy for now.
const FOCUS_X = 1112;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

const REDUCED_MQ = "(prefers-reduced-motion: reduce)";
const prefersReducedMotion = () => {
  try { return window.matchMedia(REDUCED_MQ).matches; } catch { return false; }
};
/** Live prefers-reduced-motion flag (false during prerender). */
function useReducedMotion() {
  return useSyncExternalStore(
    (cb) => {
      try { const mq = window.matchMedia(REDUCED_MQ); mq.addEventListener("change", cb); return () => mq.removeEventListener("change", cb); }
      catch { return () => {}; }
    },
    prefersReducedMotion,
    () => false,
  );
}

/** Resolve once an image URL is downloaded and decoded (never rejects). */
const preload = (src: string) => {
  const img = new Image();
  img.src = src;
  return img.decode().catch(() => {});
};

function RoomAsset({ a }: { a: Asset }) {
  const [idleReady, setIdleReady] = useState(!a.still);
  const [acting, setActing] = useState(false);
  // Browsers share one playback timeline per animated-image URL, so a one-shot
  // clip that already finished would just show its last frame. We fetch the clip
  // once as a Blob and mint a fresh object URL per play, which always starts at
  // frame 1 and costs no extra download.
  const [actionUrl, setActionUrl] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionBlob = useRef<Promise<Blob | null> | null>(null);
  const loadAction = () => {
    if (!a.action || actionBlob.current) return actionBlob.current;
    actionBlob.current = fetch(a.action.src).then((r) => (r.ok ? r.blob() : null)).catch(() => null);
    return actionBlob.current;
  };
  const reduced = useReducedMotion();

  // Idle: show the still instantly, swap to the looping animation once decoded,
  // then download the action clip in the background so a click feels instant.
  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    (async () => {
      if (a.still) { await preload(a.src); if (!cancelled) setIdleReady(true); }
      loadAction();
    })();
    return () => { cancelled = true; };
    // loadAction only reads refs/props
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a.src, a.still, reduced]);

  // Tidy up the timer and the last object URL.
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => () => { if (actionUrl) URL.revokeObjectURL(actionUrl); }, [actionUrl]);

  const play = async () => {
    if (!a.action || acting) return;   // let the current performance finish
    setActing(true);
    let ms = 2500;
    if (!reduced) {
      const blob = await loadAction();
      // fallback: a unique query string also restarts the clip (one extra download)
      setActionUrl(blob ? URL.createObjectURL(blob) : `${a.action.src}?play=${Date.now()}`);
      ms = a.action.durationMs;
    }
    timer.current = setTimeout(() => { setActing(false); setActionUrl(null); }, ms);
  };

  const style: CSSProperties = {
    left: pct(a.x, ROOM.w), top: pct(a.y, ROOM.h),
    width: pct(a.w, ROOM.w), height: pct(a.h, ROOM.h),
  };
  const idleSrc = idleReady && !reduced ? a.src : (a.still ?? a.src);
  const actionSrc = a.action && (reduced ? (a.action.still ?? a.action.src) : actionUrl);

  const img = acting && actionSrc
    ? <img key={actionSrc} src={actionSrc} alt="" draggable={false} />
    : <img key="idle" src={idleSrc} alt="" draggable={false} />;

  if (!a.action) {
    return (
      <div className="studio__asset" style={style} data-asset={a.id} role="img" aria-label={a.label}>
        {img}
      </div>
    );
  }
  return (
    <button
      type="button"
      className="studio__asset studio__asset--interactive"
      style={style}
      data-asset={a.id}
      data-acting={acting || undefined}
      onClick={play}
      onPointerEnter={() => { if (!reduced) loadAction(); }}
      aria-label={acting ? `${a.label} is dancing` : `${a.label}${a.sleepy ? " is asleep" : ""}. ${a.action.cta}`}
    >
      {img}
      {a.sleepy && !acting && (
        <span className="studio__zzz" aria-hidden="true"><i>z</i><i>z</i><i>z</i></span>
      )}
    </button>
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
        .studio__asset--interactive {
          padding: 0; border: 0; background: none; cursor: pointer; -webkit-tap-highlight-color: transparent;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1); transform-origin: 50% 100%;
        }
        .studio__asset--interactive:not([data-acting]):hover { transform: translateY(-2%) scale(1.03); }
        .studio__asset--interactive:focus-visible { outline: 3px solid var(--bauhaus-red); outline-offset: 4px; border-radius: 12px; }
        .studio__asset--interactive[data-acting] { cursor: default; }

        /* floating "z z z" while asleep */
        .studio__zzz { position: absolute; right: 4%; top: 2%; width: 30%; height: 30%; pointer-events: none; }
        .studio__zzz i {
          position: absolute; font-style: normal; font-family: var(--font-body); font-weight: 800; color: var(--bauhaus-blue);
          opacity: 0; animation: studioZ 2.7s ease-in-out infinite;
        }
        .studio__zzz i:nth-child(1) { left: 0;   bottom: 0;   font-size: clamp(9px, 0.9vw, 14px); }
        .studio__zzz i:nth-child(2) { left: 30%; bottom: 30%; font-size: clamp(11px, 1.1vw, 17px); animation-delay: 0.9s; }
        .studio__zzz i:nth-child(3) { left: 62%; bottom: 62%; font-size: clamp(13px, 1.35vw, 21px); animation-delay: 1.8s; }
        @keyframes studioZ { 0% { opacity: 0; transform: translateY(6px); } 30% { opacity: 1; } 80% { opacity: 0.9; } 100% { opacity: 0; transform: translateY(-10px); } }

        @media (prefers-reduced-motion: reduce) { .studio__zzz i { animation: none; opacity: 0.8; } }

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
