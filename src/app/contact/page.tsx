import type { Metadata } from "next";
import SiteNav, { PageHero } from "@/components/SiteNav";
import ContactPostcard from "@/components/ContactPostcard";

export const metadata: Metadata = {
  title: "Contact — Mathias Becerra",
  description: "Send Mathias a postcard, book a call, or reach out by email.",
};

export default function ContactPage() {
  return (
    <main style={{ background: "var(--paper)", minHeight: "100vh" }}>
      <SiteNav current="Contact" />
      <PageHero
        eyebrow="Contact"
        title="Let's talk"
        intro="Have a project in mind, a question, or just want to say hello? Write me a postcard below, or pick another way to reach me."
        accent="var(--bauhaus-red)"
      />
      <ContactPostcard />
    </main>
  );
}
