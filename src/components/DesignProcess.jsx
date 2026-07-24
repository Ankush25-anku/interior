"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    n: "01",
    title: "Consultation",
    desc: "We begin by listening — understanding how you live, entertain, and dream, long before a single line is drawn.",
  },
  {
    n: "02",
    title: "Space Planning",
    desc: "Every square foot is choreographed for flow, light, and proportion, before a single material is chosen.",
  },
  {
    n: "03",
    title: "3D Visualization",
    desc: "Photorealistic renders let you walk through your home and feel it, long before construction begins.",
  },
  {
    n: "04",
    title: "Material Selection",
    desc: "Stone, wood, brass, textile — each surface is sourced and matched by hand for texture, tone and light.",
  },
  {
    n: "05",
    title: "Execution",
    desc: "Our craftsmen bring the design to life with the same discipline and patience as fine architecture.",
  },
  {
    n: "06",
    title: "Final Handover",
    desc: "A final walkthrough, styled and complete — ready for the life that happens next inside it.",
  },
];

export default function DesignProcess() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const lineFillRef = useRef(null);
  const contentRef = useRef(null);
  const numberGhostRef = useRef(null);
  const mobileListRef = useRef(null);
  const frameRef = useRef(null);
  const imageParallaxRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // cinematic reveal of the background photograph
      gsap.fromTo(
        frameRef.current,
        { clipPath: "inset(6% 6% 6% 6%)", opacity: 0, scale: 1.05 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          scale: 1,
          duration: 1.4,
          ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
        }
      );

      gsap.fromTo(
        headingRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        let current = -1;

        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: () => "+=" + window.innerHeight * 3,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            gsap.set(lineFillRef.current, { scaleY: self.progress });

            // subtle background parallax tied to the pinned stepper's own progress —
            // a conventional scroll-position parallax doesn't apply while pinned
            gsap.set(imageParallaxRef.current, {
              yPercent: (self.progress - 0.5) * 12,
            });

            const idx = Math.min(
              STEPS.length - 1,
              Math.floor(self.progress * STEPS.length)
            );
            if (idx !== current) {
              current = idx;
              setActiveIndex(idx);
            }
          },
        });

        return () => st.kill();
      });

      mm.add("(max-width: 767px)", () => {
        const items = mobileListRef.current.children;
        gsap.fromTo(
          items,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.15,
            scrollTrigger: { trigger: mobileListRef.current, start: "top 85%" },
          }
        );

        // section isn't pinned on mobile, so a normal scroll-position parallax applies
        gsap.to(imageParallaxRef.current, {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!contentRef.current) return;
    gsap.fromTo(
      contentRef.current,
      { y: 22, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" }
    );
    gsap.fromTo(
      numberGhostRef.current,
      { opacity: 0 },
      { opacity: 0.08, duration: 0.9, ease: "power3.out" }
    );
  }, [activeIndex]);

  const step = STEPS[activeIndex];

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-espresso md:h-screen"
    >
      <div ref={frameRef} className="absolute inset-0">
        <div ref={imageParallaxRef} className="absolute inset-[-8%]">
          <Image
            src="/images/process/design.webp"
            alt="Design studio process detail"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* text overlay — keeps the step copy legible over the photograph */}
        <div className="absolute inset-0 bg-espresso/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso via-transparent to-espresso/55" />
      </div>

      <div className="relative z-10 flex h-full flex-col gap-14 px-6 py-28 md:flex-row md:items-center md:gap-24 md:px-16 md:py-0">
        <div ref={headingRef} className="shrink-0 md:w-72">
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Our Process</span>
          <h2 className="font-display mt-4 max-w-xs text-3xl font-normal leading-tight text-ivory md:text-4xl">
            The design journey.
          </h2>

          <div className="relative mt-12 hidden h-80 md:block">
            <div className="absolute left-[6px] top-0 h-full w-px bg-ivory/15" />
            <div
              ref={lineFillRef}
              className="absolute left-[6px] top-0 h-full w-px origin-top scale-y-0 bg-gold"
            />
            <ul className="relative flex h-full flex-col justify-between">
              {STEPS.map((s, i) => (
                <li key={s.n} className="flex items-center gap-4">
                  <span
                    className={`h-3.5 w-3.5 shrink-0 rounded-full border-2 transition-colors duration-500 ${
                      i <= activeIndex ? "border-gold bg-gold" : "border-ivory/25 bg-espresso"
                    }`}
                  />
                  <span
                    className={`text-xs uppercase tracking-[0.15em] transition-colors duration-500 ${
                      i === activeIndex ? "text-gold" : "text-ivory/40"
                    }`}
                  >
                    {s.n} &mdash; {s.title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="relative hidden flex-1 md:block">
          <div
            ref={numberGhostRef}
            aria-hidden="true"
            className="font-display pointer-events-none absolute -left-4 -top-20 select-none text-[15rem] font-normal leading-none opacity-0"
            style={{ WebkitTextStroke: "1px rgba(245,240,232,0.16)", color: "transparent" }}
          >
            {step.n}
          </div>

          <div ref={contentRef} className="relative max-w-xl">
            <span className="font-display text-lg italic text-gold">{step.n}</span>
            <h3 className="font-display mt-3 text-4xl font-normal text-ivory lg:text-5xl">
              {step.title}
            </h3>
            <p className="mt-6 max-w-md text-base leading-relaxed text-ivory/65">
              {step.desc}
            </p>
          </div>
        </div>

        <ul ref={mobileListRef} className="flex flex-col gap-10 md:hidden">
          {STEPS.map((s) => (
            <li key={s.n} className="border-l border-gold/40 pl-6">
              <span className="font-display text-lg italic text-gold">{s.n}</span>
              <h3 className="font-display mt-2 text-2xl font-normal text-ivory">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/65">{s.desc}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
