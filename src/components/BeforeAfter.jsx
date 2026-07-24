"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PiArrowsHorizontal } from "react-icons/pi";
import { RENOVATION_PROJECTS } from "@/data/beforeafter";

gsap.registerPlugin(ScrollTrigger);

export default function BeforeAfter() {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const containerRef = useRef(null);
  const afterWrapRef = useRef(null);
  const beforeWrapRef = useRef(null);
  const draggingRef = useRef(false);

  const [hovering, setHovering] = useState(false);
  const [afterLoaded, setAfterLoaded] = useState(false);
  const [beforeLoaded, setBeforeLoaded] = useState(false);
  const [projectIndex, setProjectIndex] = useState(0);

  const sliderX = useMotionValue(50);
  const invertedX = useTransform(sliderX, (v) => 100 - v);
  const beforeClip = useMotionTemplate`inset(0 ${invertedX}% 0 0)`;
  const handleLeft = useMotionTemplate`${sliderX}%`;

  const project = RENOVATION_PROJECTS[projectIndex];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        frameRef.current,
        { clipPath: "inset(8% 8% 8% 8%)", opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          opacity: 1,
          duration: 1.3,
          ease: "power4.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 70%" },
        }
      );

      // one-time auto demo sweep so first-time visitors discover the drag interaction
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 60%",
        once: true,
        onEnter: () => {
          const obj = { v: 50 };
          gsap
            .timeline({ delay: 0.7 })
            .to(obj, {
              v: 20,
              duration: 1,
              ease: "power2.inOut",
              onUpdate: () => sliderX.set(obj.v),
            })
            .to(obj, {
              v: 80,
              duration: 1.3,
              ease: "power2.inOut",
              onUpdate: () => sliderX.set(obj.v),
            })
            .to(obj, {
              v: 50,
              duration: 0.9,
              ease: "power2.inOut",
              onUpdate: () => sliderX.set(obj.v),
            });
        },
      });

      // depth parallax — before/after drift at opposite rates, reading as two
      // separate depth planes rather than one flat comparison
      gsap.to(afterWrapRef.current, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(beforeWrapRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const updateFromClientX = (clientX) => {
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((clientX - rect.left) / rect.width) * 100;
      sliderX.set(Math.min(100, Math.max(0, pct)));
    };

    const onMove = (e) => {
      if (!draggingRef.current) return;
      updateFromClientX(e.clientX);
    };
    const onUp = () => {
      draggingRef.current = false;
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [sliderX]);

  const onPointerDown = (e) => {
    draggingRef.current = true;
    const rect = containerRef.current.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    sliderX.set(Math.min(100, Math.max(0, pct)));
  };

  const goToProject = (dir) => {
    setProjectIndex((i) => (i + dir + RENOVATION_PROJECTS.length) % RENOVATION_PROJECTS.length);
    sliderX.set(50);
    setAfterLoaded(false);
    setBeforeLoaded(false);
  };

  // arrow buttons sit inside the drag surface, so a click must not also
  // register as a drag — stop the pointerdown before it reaches onPointerDown
  const stopForArrow = (e) => e.stopPropagation();

  return (
    <section
      id="renovation"
      ref={sectionRef}
      className="relative w-full bg-ivory px-6 py-28 text-ink md:px-16"
    >
      <div className="mb-14 text-center">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">
          Renovation Showcase
        </span>
        <h2 className="font-display mt-4 text-4xl font-normal md:text-5xl">
          Old Interior, <span className="italic text-gold">Reimagined</span>
        </h2>
        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-ink/55">
          Drag to compare &mdash; Old Interior &rarr; Transformed Luxury Interior
        </p>
      </div>

      <div
        ref={frameRef}
        className="relative mx-auto aspect-[16/10] w-full max-w-5xl overflow-hidden rounded-[2rem] opacity-0"
      >
        <div
          ref={containerRef}
          onPointerDown={onPointerDown}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
          className="absolute inset-0 touch-none select-none bg-espresso"
        >
          {/* AFTER — base layer, always fully visible */}
          <div className="absolute inset-0">
            <div ref={afterWrapRef} className="absolute inset-[-8%]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`after-${projectIndex}`}
                  initial={{ opacity: 0, scale: 1.06, clipPath: "inset(8% 8% 8% 8%)" }}
                  animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: afterLoaded ? 1 : 0, scale: hovering ? 1.05 : 1 }}
                    transition={{
                      opacity: { duration: 0.9, ease: "easeOut" },
                      scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                    }}
                  >
                    <Image
                      src={project.after}
                      alt={`${project.title} after the Maison Verre renovation`}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-cover"
                      onLoad={() => setAfterLoaded(true)}
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
            <span className="absolute right-5 top-5 rounded-full bg-gold px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.25em] text-ink">
              After
            </span>
          </div>

          {/* BEFORE — clipped overlay, revealed by the drag handle */}
          <motion.div className="absolute inset-0" style={{ clipPath: beforeClip }}>
            <div ref={beforeWrapRef} className="absolute inset-[-8%]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`before-${projectIndex}`}
                  initial={{ opacity: 0, scale: 1.06, clipPath: "inset(8% 8% 8% 8%)" }}
                  animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 1 }}
                    animate={{ opacity: beforeLoaded ? 1 : 0, scale: hovering ? 1.05 : 1 }}
                    transition={{
                      opacity: { duration: 0.9, ease: "easeOut" },
                      scale: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
                    }}
                  >
                    <Image
                      src={project.before}
                      alt={`${project.title} before the Maison Verre renovation`}
                      fill
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      className="object-cover"
                      onLoad={() => setBeforeLoaded(true)}
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </div>
            <span className="absolute left-5 top-5 rounded-full bg-espresso/70 px-4 py-1.5 text-[0.65rem] uppercase tracking-[0.25em] text-ivory/90 backdrop-blur-sm">
              Before
            </span>
          </motion.div>

          {/* cinematic lighting overlay — unifies both photographs into one lit scene */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 30%, rgba(201,164,92,0.18), transparent 60%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse at 50% 55%, transparent 45%, rgba(33,27,22,0.4) 100%)",
              }}
            />
          </div>

          {/* drag handle */}
          <motion.div
            className="pointer-events-none absolute top-0 h-full w-px bg-ivory/80"
            style={{ left: handleLeft }}
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-ink shadow-[0_10px_30px_rgba(33,27,22,0.35)]">
              <PiArrowsHorizontal size={18} />
            </div>
          </motion.div>

          {/* project navigation — glass gold circular buttons, middle-left / middle-right */}
          <button
            type="button"
            aria-label="Previous renovation project"
            data-cursor="hover"
            onPointerDown={stopForArrow}
            onClick={(e) => {
              e.stopPropagation();
              goToProject(-1);
            }}
            className="absolute left-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold/70 bg-white/10 text-gold backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-gold hover:text-ink md:h-14 md:w-14"
          >
            &larr;
          </button>
          <button
            type="button"
            aria-label="Next renovation project"
            data-cursor="hover"
            onPointerDown={stopForArrow}
            onClick={(e) => {
              e.stopPropagation();
              goToProject(1);
            }}
            className="absolute right-4 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-gold/70 bg-white/10 text-gold backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-gold hover:text-ink md:h-14 md:w-14"
          >
            &rarr;
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <span className="font-display text-lg italic text-gold">
          {String(projectIndex + 1).padStart(2, "0")} / {String(RENOVATION_PROJECTS.length).padStart(2, "0")}
        </span>
        <span className="h-px w-8 bg-ink/20" />
        <span className="text-xs uppercase tracking-[0.3em] text-ink/55">
          {project.shortTitle}
        </span>
      </div>
    </section>
  );
}
