"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function useMagnetic(strength = 0.4) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;

    const moveX = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3" });
    const moveY = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3" });

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      moveX(relX * strength);
      moveY(relY * strength);
    };

    const onLeave = () => {
      moveX(0);
      moveY(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);

    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return ref;
}
