"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function LoadingScreen({ onComplete }) {
  const rootRef = useRef(null);
  const counterRef = useRef(null);
  const curtainTopRef = useRef(null);
  const curtainBottomRef = useRef(null);
  const logoRef = useRef(null);
  const linesRef = useRef(null);
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add("overflow-hidden");
    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        document.documentElement.classList.remove("overflow-hidden");
        onComplete?.();
      },
    });

    tl.set(logoRef.current, { opacity: 0, y: 24 });
    tl.set(linesRef.current.querySelectorAll("line, path"), {
      strokeDashoffset: (i, el) => el.getTotalLength ? el.getTotalLength() : 1000,
      strokeDasharray: (i, el) => el.getTotalLength ? el.getTotalLength() : 1000,
    });

    tl.to(logoRef.current, { opacity: 1, y: 0, duration: 1.1, ease: "power3.out" }, 0.1);

    tl.to(
      linesRef.current.querySelectorAll("line, path"),
      { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", stagger: 0.08 },
      0.2
    );

    tl.to(
      counter,
      {
        value: 100,
        duration: 2.2,
        ease: "power2.inOut",
        onUpdate: () => setCount(Math.floor(counter.value)),
      },
      0.3
    );

    tl.to(logoRef.current, { opacity: 0, y: -16, duration: 0.5, ease: "power2.in" }, "+=0.15");
    tl.to(counterRef.current, { opacity: 0, duration: 0.4 }, "<");

    tl.to(
      curtainTopRef.current,
      { yPercent: -100, duration: 1.1, ease: "power4.inOut" },
      ">-0.1"
    );
    tl.to(
      curtainBottomRef.current,
      { yPercent: 100, duration: 1.1, ease: "power4.inOut" },
      "<"
    );

    return () => tl.kill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={rootRef} className="fixed inset-0 z-[100]">
      <div
        ref={curtainTopRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-espresso flex items-end justify-center overflow-hidden"
      >
        <div className="pb-0" />
      </div>
      <div
        ref={curtainBottomRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-espresso flex items-start justify-center overflow-hidden"
      />

      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <svg
          ref={linesRef}
          className="absolute inset-0 h-full w-full opacity-40"
          viewBox="0 0 1000 600"
          preserveAspectRatio="none"
          fill="none"
        >
          <line x1="0" y1="120" x2="1000" y2="120" stroke="#c9a45c" strokeWidth="0.5" />
          <line x1="0" y1="480" x2="1000" y2="480" stroke="#c9a45c" strokeWidth="0.5" />
          <line x1="200" y1="0" x2="200" y2="600" stroke="#c9a45c" strokeWidth="0.5" />
          <line x1="800" y1="0" x2="800" y2="600" stroke="#c9a45c" strokeWidth="0.5" />
          <path d="M0 300 L500 100 L1000 300" stroke="#c9a45c" strokeWidth="0.5" />
        </svg>

        <div ref={logoRef} className="relative flex flex-col items-center gap-4">
          <span className="font-display text-3xl italic tracking-wide text-ivory md:text-4xl">
            Maison Verre
          </span>
          <span className="text-[0.65rem] uppercase tracking-[0.5em] text-gold">
            Interior Studio
          </span>
        </div>

        <div
          ref={counterRef}
          className="absolute bottom-10 right-8 font-display text-6xl font-normal text-gold/80 md:bottom-14 md:right-16 md:text-8xl"
        >
          {String(count).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
}
