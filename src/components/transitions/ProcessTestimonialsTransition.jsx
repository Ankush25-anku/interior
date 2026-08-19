"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProcessTestimonialsTransition() {
  const rootRef = useRef(null);
  const layer1Ref = useRef(null);
  const layer2Ref = useRef(null);
  const layer3Ref = useRef(null);

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

      // stacked "story cards" fanning out as the process hands off into
      // client voices — mirrors GalleryTestimonialsTransition's motif,
      // recolored for a dark-to-sand handoff instead of ivory-to-sand
      tl.fromTo(layer1Ref.current, { y: -30, opacity: 0.9, rotate: -6 }, { y: 20, opacity: 0, rotate: -14, ease: "none" }, 0)
        .fromTo(layer2Ref.current, { y: -10, opacity: 1, rotate: 0 }, { y: 30, opacity: 0.15, rotate: 4, ease: "none" }, 0)
        .fromTo(layer3Ref.current, { y: 10, opacity: 0.9, rotate: 5 }, { y: 40, opacity: 0.6, rotate: 0, ease: "none" }, 0);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative h-[24vh] w-full overflow-hidden pointer-events-none md:h-[32vh]"
      style={{
        background: "linear-gradient(to bottom, #211b16 0%, #7a6547 55%, #d8c7ad 100%)",
      }}
    >
      <div
        ref={layer1Ref}
        className="absolute left-[30%] top-1/2 h-20 w-28 -translate-y-1/2 rounded-xl border border-gold/30 bg-espresso shadow-lg md:h-24 md:w-36"
      />
      <div
        ref={layer2Ref}
        className="absolute left-1/2 top-1/2 h-20 w-28 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-gold/70 shadow-lg md:h-24 md:w-36"
      />
      <div
        ref={layer3Ref}
        className="absolute right-[30%] top-1/2 h-20 w-28 -translate-y-1/2 rounded-xl border border-ivory/20 bg-ivory shadow-lg md:h-24 md:w-36"
      />
    </div>
  );
}
