import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";
import ProjectsExplorer from "@/components/ProjectsExplorer";

export const metadata: Metadata = {
  title: "Projects — Mathias Becerra",
  description: "Projects across design, engineering, research and storytelling, organized by field.",
};

export default function ProjectsPage() {
  return (
    <main style={{ background: "#000", minHeight: "100vh" }}>
      <SiteNav current="Projects" />
      <ProjectsExplorer />
    </main>
  );
}
