import type { Metadata } from "next";
import SiteNav, { PageHero } from "@/components/SiteNav";
import { CategoriesGrid, ProjectsGrid, TileStyles } from "@/components/ExperienceGallery";

export const metadata: Metadata = { title: "Projects — Mathias Becerra" };

export default function ProjectsPage() {
  return (
    <main style={{ background: "#000", minHeight: "100vh" }}>
      <SiteNav current="Projects" />
      <PageHero
        eyebrow="Selected work"
        title="Projects"
        intro="Projects across design, engineering, research, and storytelling. Pick a field to explore its work."
        accent="#E63329"
      />
      <TileStyles />
      <ProjectsGrid />
      <CategoriesGrid style={{ paddingTop: 3 }} />
    </main>
  );
}
