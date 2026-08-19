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

// resolves once every <img> inside `container` has finished loading (or
// fails), plus web fonts — both change layout height after the fact, which
// silently stales any ScrollTrigger start/end positions calculated earlier.
// Capped at 4s so a slow/broken image can't block the refresh forever.
function waitForLayoutSettle(container) {
  const imgPromises = container
    ? Array.from(container.querySelectorAll("img")).map((img) =>
        img.complete
          ? Promise.resolve()
          : new Promise((resolve) => {
              img.addEventListener("load", resolve, { once: true });
              img.addEventListener("error", resolve, { once: true });
            })
      )
    : [];
  const fontsReady =
    typeof document !== "undefined" && document.fonts?.ready
      ? document.fonts.ready
      : Promise.resolve();
  const timeout = new Promise((resolve) => setTimeout(resolve, 4000));
  return Promise.race([Promise.all([...imgPromises, fontsReady]), timeout]);
}

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

  // every route's images/fonts settle asynchronously and can change section
  // heights after ScrollTrigger has already calculated positions — refresh
  // again once they're actually done loading, on top of the refresh that
  // follows the enter transition below
  useEffect(() => {
    let cancelled = false;
    waitForLayoutSettle(wrapperRef.current).then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

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
