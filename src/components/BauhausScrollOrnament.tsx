"use client";
import { useEffect, useState, useRef } from "react";

export default function BauhausScrollOrnament() {
  const [scrollY, setScrollY] = useState(0);
  const [visible, setVisible] = useState(false);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef(0);

  useEffect(() => {
    const onScroll = () => { targetRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const tick = () => {
      setScrollY(prev => {
        const next = lerp(prev, targetRef.current, 0.07);
        return Math.abs(next - targetRef.current) < 0.5 ? targetRef.current : next;
      });
      setVisible(targetRef.current > 200);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const s = scrollY;

  return (
    <>
      {/* ── LEFT SIDE ORNAMENTS ──────────────────────────────── */}
      <div style={{
        position: "fixed", left: 0, top: 0, width: "clamp(60px, 8vw, 110px)",
        height: "100vh", pointerEvents: "none", zIndex: 35,
        opacity: visible ? 1 : 0, transition: "opacity 0.8s ease",
        overflow: "hidden",
      }}>
        {/* Large red circle — drifts down slowly */}
        <div style={{
          position: "absolute",
          left: "-30%",
          top: `calc(15% + ${s * 0.06}px)`,
          width: "clamp(80px, 10vw, 140px)",
          height: "clamp(80px, 10vw, 140px)",
          borderRadius: "50%",
          background: "#E7000B",
          opacity: 0.82,
          transform: `rotate(${s * 0.03}deg)`,
        }} />

        {/* Yellow square — rotates on scroll, drifts up */}
        <div style={{
          position: "absolute",
          left: "10%",
          top: `calc(42% - ${s * 0.04}px)`,
          width: "clamp(40px, 5vw, 70px)",
          height: "clamp(40px, 5vw, 70px)",
          background: "#F0B100",
          opacity: 0.75,
          transform: `rotate(${45 + s * 0.06}deg)`,
        }} />

        {/* Blue quarter-circle — slow drift */}
        <div style={{
          position: "absolute",
          left: "-40%",
          top: `calc(68% + ${s * 0.02}px)`,
          width: "clamp(90px, 12vw, 160px)",
          height: "clamp(90px, 12vw, 160px)",
          borderRadius: "0 100% 0 0",
          background: "#155DFC",
          opacity: 0.65,
        }} />

        {/* Small dark circle — fastest drift */}
        <div style={{
          position: "absolute",
          left: "20%",
          top: `calc(28% + ${s * 0.11}px)`,
          width: "clamp(14px, 2vw, 22px)",
          height: "clamp(14px, 2vw, 22px)",
          borderRadius: "50%",
          background: "#1F2937",
          opacity: 0.6,
        }} />
      </div>

      {/* ── RIGHT SIDE ORNAMENTS ─────────────────────────────── */}
      <div style={{
        position: "fixed", right: 0, top: 0, width: "clamp(60px, 8vw, 110px)",
        height: "100vh", pointerEvents: "none", zIndex: 35,
        opacity: visible ? 1 : 0, transition: "opacity 0.8s ease",
        overflow: "hidden",
      }}>
        {/* Blue morphing blob — drifts down */}
        <div className="b-morph" style={{
          position: "absolute",
          right: "-20%",
          top: `calc(10% + ${s * 0.05}px)`,
          width: "clamp(70px, 9vw, 120px)",
          height: "clamp(70px, 9vw, 120px)",
          background: "#155DFC",
          opacity: 0.78,
        }} />

        {/* Red tall rectangle — counter-drift */}
        <div style={{
          position: "absolute",
          right: "5%",
          top: `calc(38% - ${s * 0.05}px)`,
          width: "clamp(22px, 3vw, 40px)",
          height: "clamp(80px, 11vw, 140px)",
          background: "#E7000B",
          opacity: 0.7,
          transform: `rotate(${s * -0.02}deg)`,
        }} />

        {/* Yellow circle — bobs + drifts */}
        <div className="b-bob" style={{
          position: "absolute",
          right: "-15%",
          top: `calc(62% + ${s * 0.03}px)`,
          width: "clamp(60px, 8vw, 110px)",
          height: "clamp(60px, 8vw, 110px)",
          borderRadius: "50%",
          background: "#F0B100",
          opacity: 0.72,
        }} />

        {/* Spinning ring — outline only */}
        <div className="b-spin" style={{
          position: "absolute",
          right: "8%",
          top: `calc(22% + ${s * 0.08}px)`,
          width: "clamp(28px, 3.5vw, 48px)",
          height: "clamp(28px, 3.5vw, 48px)",
          borderRadius: "50%",
          border: "3px solid #E7000B",
          opacity: 0.55,
        }} />

        {/* Small cream square */}
        <div style={{
          position: "absolute",
          right: "18%",
          top: `calc(80% - ${s * 0.06}px)`,
          width: "clamp(12px, 1.8vw, 20px)",
          height: "clamp(12px, 1.8vw, 20px)",
          background: "#F5F1E8",
          opacity: 0.45,
          transform: `rotate(${s * 0.08}deg)`,
        }} />
      </div>
    </>
  );
}
