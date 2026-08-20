"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "@/components/SmoothScroll";

gsap.registerPlugin(ScrollTrigger);

const variants = {
  initial: { opacity: 0, y: 20, scale: 0.985, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, scale: 0.985, filter: "blur(8px)" },
};

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const lenis = useLenis();
  const wrapperRef = useRef(null);

  // land every route change at the top of the new page, then let Lenis
  // recompute the scrollable height once the new content has mounted
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    const id = requestAnimationFrame(() => lenis?.resize());
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);

  // Framer Motion resolves scale/y back to `transform: none` once they
  // settle at their identity values, but it leaves `filter: blur(0px)` as a
  // literal (non-"none") inline style forever. Per spec, ANY non-none filter
  // — even a 0px blur — creates a new containing block for position:fixed
  // descendants, exactly like transform does. That silently breaks GSAP's
  // pin:true sections (Services, DesignProcess): their "fixed" pin resolves
  // against this wrapper's box instead of the real viewport and renders
  // thousands of pixels off-screen. Clearing the filter once the enter
  // animation completes keeps the cinematic blur-in fully intact while
  // guaranteeing nothing lingers to trap those pins.
  const onAnimationComplete = (definition) => {
    if (definition !== "animate" || !wrapperRef.current) return;
    wrapperRef.current.style.filter = "";
    ScrollTrigger.refresh();
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        ref={wrapperRef}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        onAnimationComplete={onAnimationComplete}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
