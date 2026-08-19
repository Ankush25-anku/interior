"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { AnimatePresence, motion } from "framer-motion";

const RING_BASE = 34;

const ZONE_META = {
  button: { label: "Click", scale: 1.9 },
  services: { label: "Explore", scale: 2.6 },
  gallery: { label: "View Project", scale: 3.4 },
  hero3d: { label: "Interact", scale: 2.6 },
};

function resolveZone(target) {
  if (!(target instanceof Element)) return null;

  const gallery = target.closest(".gallery-card[data-cursor='hover']");
  if (gallery) return { zone: "gallery", el: gallery };

  const services = target.closest(".service-card[data-cursor='hover']");
  if (services) return { zone: "services", el: services };

  const hero3d = target.closest("#top canvas");
  if (hero3d) return { zone: "hero3d", el: hero3d };

  const button = target.closest("[data-cursor='hover']");
  if (button) return { zone: "button", el: button };

  return null;
}

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringWrapRef = useRef(null);
  const [zone, setZone] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const dot = dotRef.current;
    const ringWrap = ringWrapRef.current;

    const moveDotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3" });
    const moveDotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3" });
    const moveRingX = gsap.quickTo(ringWrap, "x", { duration: 0.5, ease: "power3" });
    const moveRingY = gsap.quickTo(ringWrap, "y", { duration: 0.5, ease: "power3" });

    let current = null;

    const onMove = (e) => {
      const hit = resolveZone(e.target);
      const nextZone = hit?.zone ?? null;

      if (nextZone !== current) {
        current = nextZone;
        setZone(nextZone);
        gsap.to(dot, {
          scale: nextZone ? 0 : 1,
          duration: 0.3,
          ease: "power3.out",
        });
      }

      let targetX = e.clientX;
      let targetY = e.clientY;

      // magnetic pull toward the hovered button's center
      if (nextZone === "button" && hit.el) {
        const rect = hit.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        targetX = gsap.utils.interpolate(e.clientX, cx, 0.4);
        targetY = gsap.utils.interpolate(e.clientY, cy, 0.4);
      }

      moveDotX(e.clientX);
      moveDotY(e.clientY);
      moveRingX(targetX);
      moveRingY(targetY);
    };

    const onDown = () => gsap.to(dot, { scale: current ? 0 : 0.6, duration: 0.2 });
    const onUp = () => gsap.to(dot, { scale: current ? 0 : 1, duration: 0.2 });

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const meta = zone ? ZONE_META[zone] : null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] hidden md:block">
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold mix-blend-difference"
      />

      <div ref={ringWrapRef} className="fixed left-0 top-0 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="flex items-center justify-center overflow-hidden rounded-full border border-gold/70"
          style={{ mixBlendMode: meta ? "normal" : "difference" }}
          animate={{
            width: meta ? RING_BASE * meta.scale : RING_BASE,
            height: meta ? RING_BASE * meta.scale : RING_BASE,
            backgroundColor: meta ? "rgba(201,164,92,1)" : "rgba(201,164,92,0)",
            borderColor: meta ? "rgba(201,164,92,0)" : "rgba(201,164,92,0.7)",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 26, mass: 0.5 }}
        >
          <AnimatePresence mode="wait">
            {meta && (
              <motion.span
                key={zone}
                initial={{ opacity: 0, scale: 0.6, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6, y: -4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="whitespace-nowrap text-[0.6rem] font-medium uppercase tracking-[0.2em] text-ink"
              >
                {meta.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
