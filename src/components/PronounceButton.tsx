"use client";
import { useEffect, useRef, useState } from "react";

const CLIP = "/audio/mathias-pronunciation-55f02b45.mp3";

/* Small round play button that plays how "Mathias" is pronounced.
 * The clip (12 KB) only downloads on first hover/focus/press. */
export default function PronounceButton({ size = "clamp(36px, 4vw, 56px)" }: { size?: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  const ensureAudio = () => {
    if (!audioRef.current) {
      const a = new Audio(CLIP);
      a.preload = "auto";
      a.addEventListener("ended", () => setPlaying(false));
      a.addEventListener("pause", () => setPlaying(false));
      audioRef.current = a;
    }
    return audioRef.current;
  };

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const play = () => {
    const a = ensureAudio();
    a.currentTime = 0;
    a.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  return (
    <button
      type="button"
      className="pronounce-btn"
      onClick={play}
      onPointerEnter={ensureAudio}
      onFocus={ensureAudio}
      aria-label="Play how “Mathias” is pronounced"
      title="How to pronounce “Mathias”"
      data-playing={playing || undefined}
      style={{ width: size, height: size }}
    >
      <style>{`
        .pronounce-btn {
          pointer-events: auto; flex-shrink: 0;
          display: inline-flex; align-items: center; justify-content: center;
          border-radius: 50%; border: 1.5px solid rgba(240,237,230,0.45);
          background: transparent; color: var(--cream); cursor: pointer;
          transition: background 0.2s, color 0.2s, border-color 0.2s, transform 0.2s;
        }
        .pronounce-btn:hover, .pronounce-btn:focus-visible { background: var(--cream); color: var(--ink); border-color: var(--cream); transform: scale(1.06); }
        .pronounce-btn:focus-visible { outline: 2px solid var(--bauhaus-red); outline-offset: 3px; }
        .pronounce-btn svg { width: 42%; height: 42%; display: block; }
        .pronounce-btn[data-playing] { background: var(--bauhaus-red); border-color: var(--bauhaus-red); color: #fff; }
        .pronounce-btn[data-playing] .pb-wave { animation: pbWave 0.6s ease-in-out infinite alternate; transform-origin: center; }
        @keyframes pbWave { from { opacity: 0.35 } to { opacity: 1 } }
      `}</style>
      {playing ? (
        // speaker with waves while playing
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M11 5 6 9H3v6h3l5 4V5z" fill="currentColor" />
          <path className="pb-wave" d="M15.5 8.5a5 5 0 0 1 0 7" />
          <path className="pb-wave" d="M18.5 5.5a9 9 0 0 1 0 13" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l11-6.5z" fill="currentColor" /></svg>
      )}
    </button>
  );
}
