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
  clipBottom?: number;    // room-px y below which the asset is hidden (e.g. behind the sofa)
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

  // ── Room objects (Downloads/Assets for Playground + its assets/ subfolder) ──
  // Listed in paint order: wall → shelves → sideboard → desk → sofa → coffee table → floor → coat stands.
  // Wall: geometric print and pinned postcards
  { id: "print", label: "Geometric print", x: 708, y: 172, w: 140, h: 193.0, src: "/studio/objects/print-19ad0dd1.webp" },
  { id: "postcard-lighthouse", label: "Lighthouse postcard", x: 866, y: 262, w: 72, h: 67.9, src: "/studio/objects/postcard-lighthouse-68545016.webp" },
  { id: "postcard-archway", label: "Archway postcard", x: 952, y: 298, w: 62, h: 67.4, src: "/studio/objects/postcard-archway-cecc32d3.webp" },
  { id: "postcard-mountain", label: "Mountain postcard", x: 866, y: 344, w: 72, h: 62.9, src: "/studio/objects/postcard-mountain-8a100d0c.webp" },
  // Top shelf (y≈237); the plant's pot sits on the left end, vines hanging over the edge
  { id: "llama", label: "Llama keepsake", x: 124.0, y: 119.2, w: 72, h: 119.8, src: "/studio/objects/llama-6f990cbe.webp" },
  { id: "projector", label: "Film projector", x: 216.0, y: 141.0, w: 98, h: 98.0, src: "/studio/objects/projector-32d5b8a3.webp" },
  { id: "language-books", label: "Language learning books", x: 333.0, y: 177.1, w: 104, h: 61.9, src: "/studio/objects/language-books-785b15f7.webp" },
  { id: "little-robot", label: "Little robot", x: 459.0, y: 167.8, w: 52, h: 71.2, src: "/studio/objects/little-robot-5dc07c6a.webp" },
  { id: "plant", label: "Trailing plant", x: 22, y: 161.9, w: 100, h: 197.7, src: "/studio/objects/plant-88c5eee0.webp" },
  // Lower shelf (y≈396)
  { id: "vinyl", label: "Vinyl record", x: 70.0, y: 302.9, w: 84, h: 95.1, src: "/studio/objects/vinyl-17e339f3.webp" },
  { id: "camera", label: "Camera", x: 167.0, y: 331.7, w: 76, h: 66.3, src: "/studio/objects/camera-1e7466f6.webp" },
  { id: "headphones", label: "Headphones", x: 256.0, y: 291.5, w: 98, h: 106.5, src: "/studio/objects/headphones-e1218f26.webp" },
  { id: "controller", label: "Game controller", x: 368.0, y: 341.4, w: 84, h: 56.6, src: "/studio/objects/controller-e4f1f596.webp" },
  { id: "vr-headset", label: "VR headset", x: 473, y: 334.7, w: 108, h: 63.3, src: "/studio/objects/vr-headset-0595c11b.webp" },
  { id: "origami-humanoid", label: "Origami figure", x: 515, y: 155.4, w: 40, h: 83.6, src: "/studio/objects/origami-humanoid-465842ea.webp" },
  { id: "marionette", label: "Marionette", x: 567, y: 144.4, w: 46, h: 94.6, src: "/studio/objects/marionette-3bb85eeb.webp" },
  // Sideboard (y≈566)
  { id: "family-photo", label: "Family photo", x: 122, y: 481.6, w: 96, h: 86.4, src: "/studio/objects/family-photo-451451b3.webp" },
  { id: "team-photo", label: "Team photo", x: 222, y: 504.7, w: 86, h: 63.3, src: "/studio/objects/team-photo-4cb979ca.webp" },
  { id: "globe", label: "Globe", x: 311, y: 497.6, w: 54, h: 70.4, src: "/studio/objects/globe-c2d4fc80.webp" },
  { id: "town-square", label: "Town square keepsake", x: 368, y: 509.1, w: 64, h: 58.9, src: "/studio/objects/town-square-9a532d1a.webp" },
  { id: "passport", label: "Passport and boarding pass", x: 431, y: 515, w: 48, h: 53, src: "/studio/objects/passport-38214c47.webp" },
  // Desk (y≈525–600): creative setup
  { id: "pencil-pot", label: "Pencil pot", x: 1210, y: 490.5, w: 36, h: 77.5, src: "/studio/objects/pencil-pot-a8e80d02.webp" },
  { id: "monitor", label: "Computer monitor", x: 1285, y: 440.8, w: 130, h: 111.2, src: "/studio/objects/monitor-296ecfce.webp" },
  { id: "tablet", label: "Drawing tablet", x: 1311, y: 516.1, w: 108, h: 61.9, src: "/studio/objects/tablet-e66de9b7.webp" },
  { id: "stylus", label: "Stylus", x: 1440, y: 519.9, w: 24, h: 55.1, src: "/studio/objects/stylus-055980ac.webp" },
  { id: "printer-3d", label: "3D printer", x: 1506, y: 432.4, w: 108, h: 129.6, src: "/studio/objects/printer-3d-5abe6156.webp" },
  { id: "circuit-board", label: "Circuit board", x: 1489, y: 555.2, w: 92, h: 42.8, src: "/studio/objects/circuit-board-54e37958.webp" },
  // Sofa: plush on the left cushion, letters on the right
  { id: "plush", label: "Sonic plush", x: 584.0, y: 528.3, w: 112, h: 111.7, src: "/studio/objects/plush-30768680.webp" },
  { id: "letter", label: "Letter from a mentor", x: 820.0, y: 556.7, w: 80, h: 83.3, src: "/studio/objects/letter-d2f5b815.webp" },
  { id: "envelope", label: "Sealed envelope", x: 921.0, y: 603.2, w: 58, h: 36.8, src: "/studio/objects/envelope-c560ea45.webp" },
  // Coffee table (y≈780): back row, then front row
  { id: "origami-dog", label: "Origami dog", x: 514, y: 705.3, w: 92, h: 79.7, src: "/studio/objects/origami-dog-e3f3ffcb.webp" },
  { id: "mug", label: "Mug of tea", x: 871, y: 735.9, w: 58, h: 49.1, src: "/studio/objects/mug-d6f2d260.webp" },
  { id: "house-key", label: "House key", x: 1038, y: 757, w: 64, h: 51, src: "/studio/objects/house-key-0ecfefa9.webp" },
  { id: "badge", label: "Research badge", x: 647, y: 722.1, w: 66, h: 55.9, src: "/studio/objects/badge-987752e9.webp" },
  { id: "sketchbook", label: "Sketchbook", x: 705, y: 724.2, w: 110, h: 90.8, src: "/studio/objects/sketchbook-f6896e6c.webp" },
  { id: "pencil", label: "Red pencil", x: 838, y: 796.8, w: 64, h: 13.2, src: "/studio/objects/pencil-c175259d.webp" },
  { id: "recipe", label: "Family recipe card", x: 934, y: 755.2, w: 82, h: 62.8, src: "/studio/objects/recipe-ad924141.webp" },
  // Floor
  { id: "backpack", label: "Backpack", x: 290, y: 777.9, w: 124, h: 142.1, src: "/studio/objects/backpack-1f37e912.webp" },
  { id: "sneakers", label: "Sneakers", x: 615.0, y: 845.7, w: 150, h: 84.3, src: "/studio/objects/sneakers-6ab51ba8.webp" },
  { id: "dumbbells", label: "Dumbbells", x: 162, y: 855.1, w: 104, h: 74.9, src: "/studio/objects/dumbbells-88b8bb72.webp" },
  // Coat stand in the front-left corner (drawn last, in front) with the motion-capture suit hanging on it
  { id: "coat-stand", label: "Coat stand", x: 0, y: 458, w: 146, h: 470, src: "/studio/objects/coat-stand-7356f0c5.webp" },
  { id: "mocap-suit", label: "Motion-capture suit", x: 36.4, y: 495.6, w: 90.8, h: 272.6, src: "/studio/objects/mocap-suit-ef3481b7.webp" },
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
    ...(a.clipBottom !== undefined && { clipPath: `inset(0 0 ${Math.max(0, ((a.y + a.h - a.clipBottom) / a.h) * 100)}% 0)` }),
  };
  const idleSrc = idleReady && !reduced ? a.src : (a.still ?? a.src);
  const actionSrc = a.action && (reduced ? (a.action.still ?? a.action.src) : actionUrl);

  const img = acting && actionSrc
    ? <img key={actionSrc} src={actionSrc} alt="" draggable={false} />
    : <img key="idle" src={idleSrc} alt="" draggable={false} />;

  if (!a.action) {
    return (
      <div className="studio__asset" style={style} data-asset={a.id} role="img" aria-label={a.label} title={a.label}>
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
        /* Landscape: fit the WHOLE room inside the stage (never cropped), centred.
           Leftover space is the wall colour; the image edges fade into it so there's no hard seam. */
        .studio__scene {
          position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
          width: min(100%, calc((100svh - var(--site-nav-h)) * ${ROOM.w} / ${ROOM.h}));
          aspect-ratio: ${ROOM.w} / ${ROOM.h};
        }
        .studio__room {
          -webkit-mask-image: linear-gradient(to right, transparent 0, #000 2.5%, #000 97.5%, transparent 100%), linear-gradient(to bottom, #000 0, #000 96%, transparent 100%);
          -webkit-mask-composite: source-in;
          mask-image: linear-gradient(to right, transparent 0, #000 2.5%, #000 97.5%, transparent 100%), linear-gradient(to bottom, #000 0, #000 96%, transparent 100%);
          mask-composite: intersect;
        }
        /* Portrait / narrow (taller than 4:3): keep full height, pan sideways. */
        @media (max-aspect-ratio: 4/3) {
          .studio__stage { overflow-x: auto; overflow-y: hidden; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
          .studio__stage::-webkit-scrollbar { display: none; }
          .studio__scene { left: 0; top: 0; transform: none; height: 100%; width: auto; }
          .studio__room { -webkit-mask-image: none; mask-image: none; }
        }
        .studio__room { position: absolute; inset: 0; width: 100%; height: 100%; display: block; user-select: none; }
        .studio__asset { position: absolute; }
        .studio__asset img { width: 100%; height: 100%; display: block; object-fit: contain; user-select: none; -webkit-user-drag: none; }
        .studio__asset--interactive {
          padding: 0; border: 0; background: none; cursor: pointer; -webkit-tap-highlight-color: transparent;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1); transform-origin: 50% 100%;
        }
        .studio__asset { transition: transform 0.35s cubic-bezier(0.22,1,0.36,1); transform-origin: 50% 100%; }
        .studio__asset--interactive:not([data-acting]):hover { transform: translateY(-2%) scale(1.03); }
        .studio__asset:not(.studio__asset--interactive):hover { transform: translateY(-3%) scale(1.04); }
        /* soft warm glow that follows the object's outline on hover / keyboard focus */
        .studio__asset img { transition: filter 0.3s ease; }
        .studio__asset:hover img,
        .studio__asset--interactive:focus-visible img {
          filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 10px rgba(251, 191, 36, 0.75)) drop-shadow(0 0 22px rgba(251, 191, 36, 0.4));
        }
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
