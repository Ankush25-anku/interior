"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";

export default function PageHero({ image, imageAlt, eyebrow, heading, objectPosition }) {
  const imageRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(imageRef.current, { scale: 1.15, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.6 }, 0);
    tl.fromTo(eyebrowRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, 0.35);
    tl.fromTo(headingRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.45);
    return () => tl.kill();
  }, []);

  return (
    <section className="relative flex h-[75svh] min-h-[480px] w-full items-center justify-center overflow-hidden bg-espresso text-center">
      <div className="absolute inset-0">
        <Image
          ref={imageRef}
          src={image}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-0"
          style={objectPosition ? { objectPosition } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/45 to-espresso/60" />
      </div>

      <div className="relative z-10 flex flex-col items-center px-6 pt-20">
        <span ref={eyebrowRef} className="mb-6 block text-xs uppercase tracking-[0.5em] text-gold">
          {eyebrow}
        </span>
        <h1
          ref={headingRef}
          className="font-display max-w-4xl text-[clamp(2rem,6.5vw,4.5rem)] font-normal leading-[1.08] text-[#f8f3ea] [text-shadow:0_15px_50px_rgba(0,0,0,0.35)]"
        >
          {heading}
        </h1>
      </div>
    </section>
  );
}
