"use client";

import { useEffect, useRef } from "react";

interface IntroVideoProps {
  onComplete: () => void;
}

export default function IntroVideo({ onComplete }: IntroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // autoplay blocked — skip straight to home
      onComplete();
    });

    const handleEnded = () => onComplete();
    video.addEventListener("ended", handleEnded);
    return () => video.removeEventListener("ended", handleEnded);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-40 bg-[#0d0d0d]">
      <video
        ref={videoRef}
        src="/intro.mp4"
        className="w-full h-full object-cover"
        muted
        playsInline
        preload="auto"
      />
    </div>
  );
}
