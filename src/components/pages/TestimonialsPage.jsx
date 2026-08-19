"use client";

import PageHero from "@/components/pages/PageHero";
import Testimonial from "@/components/Testimonial";

export default function TestimonialsPage() {
  return (
    <main>
      <PageHero
        image="/images/projects/bedroom.webp"
        imageAlt="Luxury bedroom interior design"
        eyebrow="Client Experiences"
        heading={
          <>
            Stories from spaces we&apos;ve <span className="italic text-gold">crafted</span>.
          </>
        }
      />
      <Testimonial />
    </main>
  );
}
