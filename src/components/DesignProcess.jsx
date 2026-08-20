"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROCESS_STEPS } from "@/data/process";

gsap.registerPlugin(ScrollTrigger);

function CornerMarkers() {
  return (
    <>
      <span className="pointer-events-none absolute -left-2 -top-2 h-6 w-6 border-l border-t border-gold/50" />
      <span className="pointer-events-none absolute -right-2 -top-2 h-6 w-6 border-r border-t border-gold/50" />
      <span className="pointer-events-none absolute -bottom-2 -left-2 h-6 w-6 border-b border-l border-gold/50" />
      <span className="pointer-events-none absolute -bottom-2 -right-2 h-6 w-6 border-b border-r border-gold/50" />
    </>
  );
}

export default function DesignProcess() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const tallWrapRef = useRef(null);
  const lineFillRef = useRef(null);
  const imageBoxRef = useRef(null);
  const imageInnerRef = useRef(null);
  const textRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const step = PROCESS_STEPS[activeIndex];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // header reveal is transform-only — never opacity. Fully visible from
      // first paint; this only nudges it up once in view.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.from(headerRef.current, { y: 32, duration: 1, ease: "power3.out" });
        },
      });

      // 768px+ (tablet + desktop share one mechanism; only CSS sizing
      // differs between them). Normal document flow — no pin:true, no
      // pin-spacer, no position:fixed. `tallWrapRef` is a tall block whose
      // child panel is `position: sticky` (pure CSS, zero JS dependency to
      // hold it on screen). A single scrubbed ScrollTrigger maps scroll
      // progress within that tall block to a discrete active step.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const wrap = tallWrapRef.current;
        let current = -1;

        const st = ScrollTrigger.create({
          trigger: wrap,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          onUpdate: (self) => {
            gsap.set(lineFillRef.current, { scaleY: self.progress });

            const raw = self.progress * PROCESS_STEPS.length;
            const idx = Math.min(PROCESS_STEPS.length - 1, Math.floor(raw));
            const sub = raw - idx;
            // subtle continuous parallax within each step's own dwell
            gsap.set(imageInnerRef.current, { yPercent: (sub - 0.5) * 6 });

            if (idx !== current) {
              current = idx;
              setActiveIndex(idx);
            }
          },
        });

        return () => st.kill();
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // signature step transition — image crossfades via scale + blur (never
  // opacity), text slides in via translateY only. overwrite:"auto" means a
  // fast scroll that retriggers this before the previous tween finishes
  // just redirects it smoothly — worst case under very fast scrolling is a
  // softly blurred/offset frame, never an invisible one.
  useEffect(() => {
    if (!imageBoxRef.current) return;
    gsap.fromTo(
      imageBoxRef.current,
      { scale: 1.08, filter: "blur(8px)" },
      { scale: 1, filter: "blur(0px)", duration: 0.7, ease: "power3.out", overwrite: "auto" }
    );
    gsap.fromTo(
      textRef.current,
      { y: 40 },
      { y: 0, duration: 0.6, ease: "power3.out", overwrite: "auto" }
    );
  }, [activeIndex]);

  return (
    <section id="process" ref={sectionRef} className="relative w-full bg-espresso">
      {/* 768px+ — cinematic vertical journey, tablet and desktop share one
          system; sizing scales down via responsive classes on tablet. */}
      <div className="hidden md:block">
        <div ref={tallWrapRef} className="h-[600vh]">
          <div className="sticky top-0 flex h-screen items-center gap-10 overflow-hidden px-10 lg:gap-20 lg:px-16">
            <div ref={headerRef} className="w-[240px] shrink-0 lg:w-[340px]">
              <span className="text-xs uppercase tracking-[0.35em] text-gold">Our Process</span>
              <h2 className="font-display mt-4 text-3xl font-normal leading-tight text-ivory lg:text-4xl">
                The Art of Creating Spaces
              </h2>
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/60">
                From the first conversation to the final reveal, every detail is thoughtfully
                crafted.
              </p>

              <div className="relative mt-10 flex gap-5 lg:mt-14">
                <div className="relative w-px shrink-0 bg-ivory/15">
                  <div
                    ref={lineFillRef}
                    className="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-gold"
                  />
                </div>

                <ul className="flex flex-col gap-5 lg:gap-6">
                  {PROCESS_STEPS.map((s, i) => (
                    <li key={s.n} data-cursor="hover" className="flex items-baseline gap-3">
                      <span
                        className={`font-display text-base italic transition-all duration-500 ${
                          i === activeIndex ? "scale-110 text-gold" : "scale-100 text-ivory/30"
                        }`}
                      >
                        {s.n}
                      </span>
                      <span
                        className={`text-xs uppercase tracking-[0.15em] transition-colors duration-500 ${
                          i === activeIndex ? "text-ivory" : "text-ivory/30"
                        }`}
                      >
                        {s.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 text-xs uppercase tracking-[0.25em] text-ivory/40 lg:mt-14">
                {String(activeIndex + 1).padStart(2, "0")} / {String(PROCESS_STEPS.length).padStart(2, "0")}
              </div>
            </div>

            <div className="min-w-0 flex-1">
              <div
                ref={imageBoxRef}
                data-cursor="hover"
                className="relative h-[42vh] w-full overflow-hidden rounded-2xl border border-ivory/10 lg:h-[56vh]"
              >
                <div ref={imageInnerRef} className="absolute inset-[-6%]">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    sizes="(min-width: 1024px) 60vw, 55vw"
                    className="object-cover"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
                <CornerMarkers />
              </div>

              <div ref={textRef} className="mt-8 max-w-lg">
                <span className="font-display text-lg italic text-gold">{step.n}</span>
                <h3 className="font-display mt-2 text-3xl font-normal text-ivory lg:text-4xl">
                  {step.title}
                </h3>
                <p className="mt-4 text-base leading-relaxed text-ivory/65">{step.description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* below 768px — plain vertical timeline, Framer Motion, transform
          only (never opacity). Normal document flow, no sticky, no
          scroll-jacking of any kind. */}
      <div className="md:hidden">
        <div className="px-6 pb-4 pt-20">
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Our Process</span>
          <h2 className="font-display mt-4 text-4xl font-normal leading-tight text-ivory">
            The Art of Creating Spaces
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-ivory/60">
            From the first conversation to the final reveal, every detail is thoughtfully
            crafted.
          </p>
        </div>

        <div className="flex flex-col gap-16 px-6 pb-24 pt-12">
          {PROCESS_STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ y: 40, scale: 0.97 }}
              whileInView={{ y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="font-display text-lg italic text-gold">{s.n}</span>
              <div className="relative mt-3 h-64 w-full overflow-hidden rounded-2xl border border-ivory/10">
                <Image src={s.image} alt={s.title} fill sizes="100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-espresso/70 via-transparent to-transparent" />
                <CornerMarkers />
              </div>
              <h3 className="font-display mt-5 text-2xl font-normal text-ivory">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/65">{s.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
