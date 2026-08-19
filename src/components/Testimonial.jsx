"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { TESTIMONIALS } from "@/data/testimonials";

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
}

export default function Testimonial() {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const layerScale = useTransform(scrollYProgress, [0, 0.25, 0.8, 1], [0.88, 1, 1, 0.92]);
  const layerOpacity = useTransform(scrollYProgress, [0, 0.2, 0.82, 1], [0, 1, 1, 0.4]);

  const go = (dir) => {
    setDirection(dir);
    setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => go(1), 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  const current = TESTIMONIALS[index];

  return (
    <section
      id="testimonials"
      ref={sectionRef}
      className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-sand px-6 py-28 text-ink md:px-16"
    >
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #c9a45c, transparent 70%)" }}
      />

      <motion.div
        style={{ scale: layerScale, opacity: layerOpacity }}
        className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center"
      >
        <span className="mb-10 text-xs uppercase tracking-[0.35em] text-gold">
          Testimonials
        </span>

        <div className="relative h-[22rem] w-full" style={{ perspective: 1200 }}>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, rotateY: direction * 35, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, rotateY: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, rotateY: -direction * 35, y: -20, scale: 0.94 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(e, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
              className="absolute inset-0 flex touch-pan-y flex-col items-center justify-center rounded-[2rem] border border-ink/10 bg-ivory/70 px-8 py-10 shadow-[0_30px_60px_-30px_rgba(33,27,22,0.25)] backdrop-blur-sm active:cursor-grabbing md:px-16"
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="flex h-16 w-16 items-center justify-center rounded-full bg-gold font-display text-lg text-ink"
              >
                {initials(current.name)}
              </motion.div>

              <p className="font-display mt-8 max-w-xl text-xl font-normal italic leading-relaxed text-ink/90 md:text-2xl">
                &ldquo;{current.quote}&rdquo;
              </p>

              <div className="mt-8 flex flex-col items-center gap-2">
                <div className="text-sm font-medium tracking-wide text-ink">
                  {current.name}
                </div>
                <div className="text-xs uppercase tracking-[0.2em] text-ink/50">
                  {current.role} &mdash; {current.location}
                </div>
                <span className="mt-2 rounded-full border border-gold/40 px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-gold">
                  {current.projectType}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-10 flex items-center gap-6">
          <button
            aria-label="Previous testimonial"
            data-cursor="hover"
            onClick={() => go(-1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-gold hover:text-gold"
          >
            &larr;
          </button>

          <div className="flex gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.name}
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => {
                  setDirection(i > index ? 1 : -1);
                  setIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  i === index ? "w-8 bg-gold" : "w-1.5 bg-ink/20"
                }`}
              />
            ))}
          </div>

          <button
            aria-label="Next testimonial"
            data-cursor="hover"
            onClick={() => go(1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 text-ink transition-colors hover:border-gold hover:text-gold"
          >
            &rarr;
          </button>
        </div>
      </motion.div>
    </section>
  );
}
