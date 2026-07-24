"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ServicesGalleryTransition() {
  const rootRef = useRef(null);
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // a service "card" silhouette expanding into a full-bleed "image" rectangle
      tl.fromTo(
        cardRef.current,
        { width: "9rem", height: "12rem", opacity: 0, borderRadius: "1.5rem" },
        { width: "20rem", height: "13rem", opacity: 1, borderRadius: "0.5rem", ease: "none" },
        0
      ).to(cardRef.current, { opacity: 0, scale: 1.05, ease: "none" }, 0.75);

      tl.fromTo(
        glowRef.current,
        { opacity: 0, scale: 0.6 },
        { opacity: 0.5, scale: 1.4, ease: "none" },
        0
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative h-[18vh] w-full overflow-hidden pointer-events-none md:h-[22vh]"
      style={{
        background: "linear-gradient(to bottom, #211b16 0%, #7a6547 50%, #f5f0e8 100%)",
      }}
    >
      <div
        ref={glowRef}
        className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/20 blur-3xl"
      />
      <div
        ref={cardRef}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border border-gold/50 bg-gold/5"
      />
    </div>
  );
}
