import CategoryPageClient from "./CategoryPageClient";

const CATEGORY_KEYS = [
  "music-production", "graphic-design", "design", "sketches", "ethics",
  "logo-designs", "others", "uxui", "logo-story", "3d-modelling",
  "game-development", "app-development", "filmmaking", "web-development",
  "electronics", "research", "miscellaneous",
];

export function generateStaticParams() {
  return CATEGORY_KEYS.map((category) => ({ category }));
}

export default function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  return <CategoryPageClient params={params} />;
}
