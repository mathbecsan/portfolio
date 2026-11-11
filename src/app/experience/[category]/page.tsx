import CategoryPageClient from "./CategoryPageClient";

const CATEGORY_KEYS = [
  "music-production", "human-robot-interaction", "data-visualization", "digital-fabrication", "photography",
  "immersive-technologies", "visual-arts-crafting", "uxui", "logo-story", "physical-digital-animation",
  "game-development", "app-development", "filmmaking", "web-development",
  "physical-computing-hardware", "ai-governance-research", "community-education",
];

export function generateStaticParams() {
  return CATEGORY_KEYS.map((category) => ({ category }));
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  return <CategoryPageClient params={params} />;
}
