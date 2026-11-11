import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import StudioRoom from "@/components/StudioRoom";

export const metadata: Metadata = {
  title: "Interactive Studio — Mathias Becerra",
  description: "An illustrated studio to explore fun facts about Mathias, one object at a time.",
};

export default function PlaygroundPage() {
  return (
    <main style={{ background: "#FCEEDF", minHeight: "100svh" }}>
      <SiteNav current="Interactive Studio" />
      <StudioRoom />
    </main>
  );
}
