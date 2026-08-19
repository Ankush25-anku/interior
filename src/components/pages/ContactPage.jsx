"use client";

import PageHero from "@/components/pages/PageHero";
import Contact from "@/components/Contact";

export default function ContactPage() {
  return (
    <main>
      <PageHero
        image="/images/services/renovation.webp"
        imageAlt="Warmly lit luxury interior renovation"
        eyebrow="Get in Touch"
        heading={
          <>
            Let&apos;s create your <span className="italic text-gold">dream space</span>.
          </>
        }
      />
      <Contact />
    </main>
  );
}
