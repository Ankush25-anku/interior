"use client";

import PageHero from "@/components/pages/PageHero";
import DesignProcess from "@/components/DesignProcess";

export default function ProcessPage() {
  return (
    <main>
      <PageHero
        image="/images/process/design.webp"
        imageAlt="Design studio process detail"
        eyebrow="Our Process"
        heading={
          <>
            From vision to <span className="italic text-gold">reality</span>.
          </>
        }
      />
      <DesignProcess />
    </main>
  );
}
