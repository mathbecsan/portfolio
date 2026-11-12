import { ViewTransition } from "react";

/* Page transitions. A template (unlike the layout) is re-created on every navigation,
 * so this <ViewTransition> exits with the old page and enters with the new one.
 *  - Tabs to the right → "nav-forward", tabs to the left / logo → "nav-back" (SiteNav sets these).
 *  - Anything else (e.g. browser Back/Forward) → crossfade.
 * The nav itself is anchored via view-transition-name "site-nav". Styles: globals.css. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "nav-fade" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "nav-fade" }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
