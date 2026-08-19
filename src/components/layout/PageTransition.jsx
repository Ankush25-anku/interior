"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "@/components/SmoothScroll";

const variants = {
  initial: { opacity: 0, y: 20, scale: 0.985, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, scale: 0.985, filter: "blur(8px)" },
};

export default function PageTransition({ children }) {
  const pathname = usePathname();
  const lenis = useLenis();

  // land every route change at the top of the new page, then let Lenis
  // recompute the scrollable height once the new content has mounted
  useEffect(() => {
    lenis?.scrollTo(0, { immediate: true });
    const id = requestAnimationFrame(() => lenis?.resize());
    return () => cancelAnimationFrame(id);
  }, [pathname, lenis]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
