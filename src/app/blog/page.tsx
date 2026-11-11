import type { Metadata } from "next";
import SiteNav, { PageHero } from "@/components/SiteNav";
import ComingSoon from "@/components/ComingSoon";

export const metadata: Metadata = { title: "Blog — Mathias Becerra" };

export default function BlogPage() {
  return (
    <main style={{ background: "#FFF3DE", minHeight: "100vh" }}>
      <SiteNav current="Blog" />
      <PageHero
        eyebrow="Writing"
        title="Blog"
        intro="Notes on design, research, technology, and the stories behind the work."
        accent="#1F2937"
      />
      <ComingSoon message="The first posts are being written. Check back soon." />
    </main>
  );
}
