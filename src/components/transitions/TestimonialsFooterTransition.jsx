"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function TestimonialsFooterTransition() {
  const rootRef = useRef(null);
  const dotRef = useRef(null);
  const lineRef = useRef(null);

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

      tl.fromTo(dotRef.current, { scale: 0.4, opacity: 0.9 }, { scale: 1.6, opacity: 0, ease: "none" }, 0);
      tl.fromTo(lineRef.current, { scaleY: 0, opacity: 0.6 }, { scaleY: 1, opacity: 0, ease: "none" }, 0);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative h-[20vh] w-full overflow-hidden pointer-events-none md:h-[26vh]"
      style={{
        background: "linear-gradient(to bottom, #d8c7ad 0%, #7a6547 50%, #211b16 100%)",
      }}
    >
      <div
        ref={lineRef}
        className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gold/50"
      />
      <div
        ref={dotRef}
        className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold"
      />
    </div>
  );
}
