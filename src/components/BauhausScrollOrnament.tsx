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
      {/* ── LEFT — subtle single accent ── */}
      <div style={{
        position: "fixed", left: 0, top: 0,
        width: "clamp(40px, 5vw, 64px)",
        height: "100vh", pointerEvents: "none", zIndex: 35,
        opacity: visible ? 0.7 : 0, transition: "opacity 0.8s ease",
        overflow: "hidden",
      }}>
        {/* Red circle drifting */}
        <div style={{
          position: "absolute", left: "-30%",
          top: `calc(20% + ${s * 0.05}px)`,
          width: "clamp(50px, 7vw, 90px)", height: "clamp(50px, 7vw, 90px)",
          borderRadius: "50%", background: "#E7000B", opacity: 0.75,
        }} />
        {/* Yellow square rotating */}
        <div style={{
          position: "absolute", left: "5%",
          top: `calc(52% - ${s * 0.04}px)`,
          width: "clamp(20px, 3vw, 36px)", height: "clamp(20px, 3vw, 36px)",
          background: "#F0B100", opacity: 0.65,
          transform: `rotate(${45 + s * 0.05}deg)`,
        }} />
        {/* Blue quarter-circle */}
        <div style={{
          position: "absolute", left: "-50%",
          top: `calc(72% + ${s * 0.02}px)`,
          width: "clamp(60px, 8vw, 100px)", height: "clamp(60px, 8vw, 100px)",
          borderRadius: "0 100% 0 0", background: "#155DFC", opacity: 0.6,
        }} />
      </div>

      {/* ── RIGHT — single spinning ring only ── */}
      <div style={{
        position: "fixed", right: "clamp(8px, 1.5vw, 20px)", top: "50%",
        transform: "translateY(-50%)",
        pointerEvents: "none", zIndex: 35,
        opacity: visible ? 0.5 : 0, transition: "opacity 0.8s ease",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
      }}>
        <div className="b-spin" style={{
          width: "clamp(16px, 2vw, 28px)", height: "clamp(16px, 2vw, 28px)",
          borderRadius: "50%", border: "2px solid #E7000B",
          transform: `translateY(${-s * 0.03}px)`,
        }} />
        <div style={{
          width: 1, height: "clamp(40px, 6vh, 80px)",
          background: "rgba(240,237,230,0.15)",
        }} />
        <div style={{
          width: "clamp(8px, 1vw, 12px)", height: "clamp(8px, 1vw, 12px)",
          borderRadius: "50%", background: "#F0B100", opacity: 0.6,
          transform: `translateY(${s * 0.04}px)`,
        }} />
      </div>
    </>
  );
}
