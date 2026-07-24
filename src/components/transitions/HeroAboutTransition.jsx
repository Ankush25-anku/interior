"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function HeroAboutTransition() {
  const rootRef = useRef(null);
  const shape1Ref = useRef(null);
  const shape2Ref = useRef(null);
  const shape3Ref = useRef(null);

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

      tl.fromTo(
        shape1Ref.current,
        { yPercent: -70, opacity: 0, scale: 1.4, filter: "blur(0px)" },
        { yPercent: 50, opacity: 0.9, scale: 0.5, filter: "blur(6px)", ease: "none" },
        0
      ).fromTo(
        shape2Ref.current,
        { yPercent: -40, opacity: 0, scale: 0.7 },
        { yPercent: 80, opacity: 0.35, scale: 1.3, ease: "none" },
        0
      ).fromTo(
        shape3Ref.current,
        { yPercent: -90, opacity: 0, rotate: -8 },
        { yPercent: 30, opacity: 0.6, rotate: 6, ease: "none" },
        0
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative h-[24vh] w-full overflow-hidden pointer-events-none md:h-[32vh]"
      style={{
        background:
          "linear-gradient(to bottom, #211b16 0%, #3a2f22 28%, #7a6547 58%, #d8c7ad 82%, #f5f0e8 100%)",
      }}
    >
      <div
        ref={shape1Ref}
        className="absolute left-[12%] top-1/2 h-36 w-36 rounded-full bg-gold/25 blur-2xl md:h-48 md:w-48"
      />
      <div
        ref={shape2Ref}
        className="absolute right-[18%] top-1/3 h-20 w-20 rounded-full border border-gold/40 md:h-28 md:w-28"
      />
      <div
        ref={shape3Ref}
        className="absolute left-1/2 top-1/4 h-24 w-24 -translate-x-1/2 rounded-3xl border border-ivory/15 md:h-32 md:w-32"
      />
    </div>
  );
}
