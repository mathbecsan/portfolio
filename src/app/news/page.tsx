import type { Metadata } from "next";
import SiteNav, { PageHero } from "@/components/SiteNav";
import NewsTimeline from "@/components/NewsTimeline";

export const metadata: Metadata = { title: "News — Mathias Becerra" };

export default function NewsPage() {
  return (
    <main style={{ background: "#F5F1E8", minHeight: "100vh" }}>
      <SiteNav current="News" />
      <PageHero
        eyebrow="News & updates"
        title="News"
        intro="Awards, fellowships, programs, and milestones."
        accent="#FBBF24"
      />
      <NewsTimeline />
    </main>
  );
}
