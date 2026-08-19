"use client";

import PageHero from "@/components/pages/PageHero";
import Gallery from "@/components/Gallery";

export default function ProjectsPage() {
  return (
    <main>
      <PageHero
        image="/images/projects/villa.webp"
        imageAlt="Luxury villa living room interior"
        eyebrow="Portfolio"
        heading={<>Our signature <span className="italic text-gold">spaces</span>.</>}
      />
      <Gallery />
    </main>
  );
}
