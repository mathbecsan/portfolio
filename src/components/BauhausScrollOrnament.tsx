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
  // Scroll-driven "breathing" pulse — shapes gently grow/shrink as you move through sections
  const pulse = 1 + Math.sin(s / 220) * 0.18;
  // Orbit angle — drives satellite shapes that swing around their anchors as you scroll
  const orbit = s * 0.012;
  const orbitX = Math.cos(orbit) * 26;
  const orbitY = Math.sin(orbit) * 26;
  // Morph factor 0..1, oscillates so shapes shift between circle/diamond
  const morph = (Math.sin(s / 260) + 1) / 2;

  return (
    <>
      {/* ── LEFT SIDE ORNAMENTS ──────────────────────────────── */}
      <div style={{
        position: "fixed", left: 0, top: 0, width: "clamp(60px, 8vw, 110px)",
        height: "100vh", pointerEvents: "none", zIndex: 35,
        opacity: visible ? 1 : 0, transition: "opacity 0.8s ease",
        overflow: "hidden",
      }}>
        {/* Large red circle — drifts down, breathes, and spins as you scroll */}
        <div style={{
          position: "absolute",
          left: "-30%",
          top: `calc(15% + ${s * 0.06}px)`,
          width: "clamp(80px, 10vw, 140px)",
          height: "clamp(80px, 10vw, 140px)",
          borderRadius: `${50 - morph * 35}%`,
          background: "#E7000B",
          opacity: 0.82,
          transform: `rotate(${s * 0.12}deg) scale(${pulse})`,
          transition: "transform 0.3s ease-out, border-radius 0.4s ease-out",
        }} />

        {/* Yellow satellite — orbits around the red circle as you scroll */}
        <div style={{
          position: "absolute",
          left: `calc(-30% + clamp(40px,5vw,70px) + ${orbitX}px)`,
          top: `calc(15% + ${s * 0.06}px + clamp(40px,5vw,70px) + ${orbitY}px)`,
          width: "clamp(18px, 2.4vw, 32px)",
          height: "clamp(18px, 2.4vw, 32px)",
          borderRadius: "50%",
          background: "#F0B100",
          opacity: 0.85,
        }} />

        {/* Blue quarter-circle — slow drift, morphs corner radius with scroll */}
        <div style={{
          position: "absolute",
          left: "-40%",
          top: `calc(68% + ${s * 0.02}px)`,
          width: "clamp(90px, 12vw, 160px)",
          height: "clamp(90px, 12vw, 160px)",
          borderRadius: `0 ${50 + Math.sin(s / 180) * 50}% 0 0`,
          background: "#155DFC",
          opacity: 0.65,
          transform: `rotate(${-s * 0.05}deg)`,
          transition: "border-radius 0.4s ease-out, transform 0.3s ease-out",
        }} />
      </div>

      {/* ── RIGHT SIDE ORNAMENTS ─────────────────────────────── */}
      <div style={{
        position: "fixed", right: 0, top: 0, width: "clamp(60px, 8vw, 110px)",
        height: "100vh", pointerEvents: "none", zIndex: 35,
        opacity: visible ? 1 : 0, transition: "opacity 0.8s ease",
        overflow: "hidden",
      }}>
        {/* Blue morphing blob — drifts down, breathes opposite the left circle */}
        <div className="b-morph" style={{
          position: "absolute",
          right: "-20%",
          top: `calc(10% + ${s * 0.05}px)`,
          width: "clamp(70px, 9vw, 120px)",
          height: "clamp(70px, 9vw, 120px)",
          background: "#155DFC",
          opacity: 0.78,
          transform: `scale(${2 - pulse}) rotate(${s * 0.08}deg)`,
          transition: "transform 0.3s ease-out",
        }} />

        {/* Yellow circle — bobs + drifts + morphs between circle and diamond as you scroll */}
        <div className="b-bob" style={{
          position: "absolute",
          right: "-15%",
          top: `calc(62% + ${s * 0.03}px)`,
          width: "clamp(60px, 8vw, 110px)",
          height: "clamp(60px, 8vw, 110px)",
          borderRadius: `${50 - morph * 50}%`,
          background: "#F0B100",
          opacity: 0.72,
          transform: `scale(${pulse}) rotate(${morph * 45}deg)`,
          transition: "transform 0.3s ease-out, border-radius 0.4s ease-out",
        }} />

        {/* Red satellite — orbits the spinning ring as you scroll */}
        <div style={{
          position: "absolute",
          right: `calc(8% + ${-orbitX}px)`,
          top: `calc(22% + ${s * 0.08}px + ${orbitY}px)`,
          width: "clamp(14px, 1.8vw, 24px)",
          height: "clamp(14px, 1.8vw, 24px)",
          borderRadius: "50%",
          background: "#E7000B",
          opacity: 0.8,
        }} />

        {/* Spinning ring — speed tied to scroll velocity */}
        <div className="b-spin" style={{
          position: "absolute",
          right: "8%",
          top: `calc(22% + ${s * 0.08}px)`,
          width: "clamp(28px, 3.5vw, 48px)",
          height: "clamp(28px, 3.5vw, 48px)",
          borderRadius: "50%",
          border: "3px solid #155DFC",
          opacity: 0.55,
          transform: `rotate(${s * 0.4}deg)`,
        }} />
      </div>
    </>
  );
}
