"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Visiting any page other than the homepage counts as "already in the site":
 * the homepage then skips its preloader + logo intro when you navigate back.
 * Same key as src/app/page.tsx. */
export default function IntroSeenMarker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname && pathname !== "/") {
      try { sessionStorage.setItem("mb-intro-seen", "1"); } catch {}
    }
  }, [pathname]);
  return null;
}
