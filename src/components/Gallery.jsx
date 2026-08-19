"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PROJECTS, PROJECT_CATEGORIES } from "@/data/gallery";

gsap.registerPlugin(ScrollTrigger);

function ProjectCard({ project, onHover, isFirst }) {
  return (
    <motion.div
      layout
      className={`gallery-card group relative mb-6 w-full overflow-hidden rounded-2xl break-inside-avoid ${project.aspect}`}
      data-cursor="hover"
      initial={
        isFirst
          ? { opacity: 0, y: 90, scale: 1.12, clipPath: "inset(18% 18% 18% 18%)" }
          : { opacity: 0, y: 60, clipPath: "inset(12% 12% 12% 12%)" }
      }
      whileInView={{ opacity: 1, y: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
      exit={{ opacity: 0, scale: 0.92, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      whileHover="hover"
    >
      <motion.div
        className="absolute inset-0"
        variants={{ hover: { scale: 1.08 } }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={project.image}
          alt={project.alt}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 bg-espresso/25 opacity-0"
        variants={{ hover: { opacity: 1 } }}
        transition={{ duration: 0.4 }}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-espresso/75 via-espresso/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 p-6">
        <span className="text-[0.6rem] uppercase tracking-[0.3em] text-gold">
          {project.category}
        </span>
        <h3 className="font-display mt-1 text-2xl font-normal text-ivory">
          {project.title}
        </h3>
        {project.location && (
          <p className="mt-1 text-xs text-ivory/60">{project.location}</p>
        )}
      </div>
    </motion.div>
  );
}

export default function Gallery() {
  const containerRef = useRef(null);
  const gridRef = useRef(null);
  const [hovering, setHovering] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredProjects = useMemo(
    () =>
      activeCategory === "All"
        ? PROJECTS
        : PROJECTS.filter((project) => project.category === activeCategory),
    [activeCategory]
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 25, stiffness: 300 });
  const springY = useSpring(y, { damping: 25, stiffness: 300 });

  // the cursor-follow badge is a fine-pointer affordance only — on touch
  // devices (including touch-capable tablets/laptops at desktop widths)
  // synthetic hover events shouldn't be able to leave it stuck on screen
  const setHoveringGuarded = (value) => {
    if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) return;
    setHovering(value);
  };

  const handleMouseMove = (e) => {
    const rect = containerRef.current.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      // exit: gallery dims and settles as it fades into the testimonial layer
      gsap.to(gridRef.current, {
        opacity: 0.82,
        scale: 0.98,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "bottom 90%",
          end: "bottom 20%",
          scrub: true,
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="projects"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full bg-ivory px-6 py-28 md:px-16"
    >
      <div className="mb-10 flex flex-col gap-8 md:mb-14 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Portfolio</span>
          <h2 className="font-display mt-4 max-w-xl text-4xl font-normal text-ink md:text-5xl">
            Selected Projects
          </h2>
        </div>

        <div className="flex flex-wrap gap-2">
          {PROJECT_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              data-cursor="hover"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-[0.65rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                activeCategory === category
                  ? "border-gold bg-gold text-ink"
                  : "border-ink/15 text-ink/60 hover:border-gold hover:text-gold"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div ref={gridRef} className="columns-1 gap-6 sm:columns-2 lg:columns-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, i) => (
            <ProjectCard key={project.title} project={project} onHover={setHoveringGuarded} isFirst={i === 0} />
          ))}
        </AnimatePresence>
      </div>

      <motion.div
        className="pointer-events-none absolute left-0 top-0 z-20 hidden h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-gold text-[0.65rem] uppercase tracking-[0.2em] text-ink md:flex"
        style={{ x: springX, y: springY }}
        animate={{ scale: hovering ? 1 : 0, opacity: hovering ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        View Project
      </motion.div>
    </section>
  );
}
