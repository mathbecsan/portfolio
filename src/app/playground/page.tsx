import type { Metadata } from "next";
import SiteNav, { PageHero } from "@/components/SiteNav";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Interactive Studio — Mathias Becerra" };

export default function PlaygroundPage() {
  return (
    <main style={{ background: "#FFF3DE", minHeight: "100vh" }}>
      <SiteNav current="Interactive Studio" />
      <PageHero
        eyebrow="Playground"
        title="Interactive Studio"
        intro="A playground of experiments, prototypes, and interactive toys you can try right in the browser."
        accent="#005CAA"
      />
      <ComingSoon message="The studio doors open soon — experiments and interactive prototypes are being built." />
    </main>
  );
}
