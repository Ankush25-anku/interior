"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function AboutServicesTransition() {
  const rootRef = useRef(null);
  const ruleRef = useRef(null);
  const panelRef = useRef(null);
  const grainRef = useRef(null);

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

      // "typography expands" — a rule that grows and thins into a line
      tl.fromTo(
        ruleRef.current,
        { scaleX: 0, opacity: 0 },
        { scaleX: 1, opacity: 0.8, ease: "none" },
        0
      ).to(ruleRef.current, { scaleX: 1.6, opacity: 0, ease: "none" }, 0.6);

      // "image morph effect" — the about panel echo warps into a card shape
      tl.fromTo(
        panelRef.current,
        { scale: 0.9, opacity: 0, borderRadius: "2rem", rotate: -3 },
        { scale: 1, opacity: 1, borderRadius: "0.75rem", rotate: 0, ease: "none" },
        0
      );

      // "background texture changes"
      tl.fromTo(grainRef.current, { opacity: 0 }, { opacity: 0.5, ease: "none" }, 0.2);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative h-[24vh] w-full overflow-hidden pointer-events-none md:h-[32vh]"
      style={{
        background: "linear-gradient(to bottom, #f5f0e8 0%, #d8c7ad 35%, #7a6547 70%, #211b16 100%)",
      }}
    >
      <div
        ref={grainRef}
        className="absolute inset-0 opacity-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          mixBlendMode: "overlay",
        }}
      />
      <div
        ref={ruleRef}
        className="absolute left-1/2 top-1/2 h-px w-2/3 -translate-x-1/2 -translate-y-1/2 bg-gold"
      />
      <div
        ref={panelRef}
        className="absolute left-1/2 top-1/2 h-16 w-28 -translate-x-1/2 -translate-y-1/2 border border-gold/50 md:h-20 md:w-40"
      />
    </div>
  );
}
