"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import useMagnetic from "@/hooks/useMagnetic";
import { useLenis } from "@/components/SmoothScroll";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Gallery", href: "#gallery" },
  { label: "Testimonials", href: "#testimonials" },
];

export default function Navbar({ ready }) {
  const rootRef = useRef(null);
  const ctaRef = useMagnetic(0.3);
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [transparent, setTransparent] = useState(true);

  useEffect(() => {
    if (!ready) return;
    gsap.fromTo(
      rootRef.current,
      { y: -40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );
  }, [ready]);

  useEffect(() => {
    if (!lenis) return;
    let lastY = 0;
    const onScroll = ({ scroll }) => {
      setHidden(scroll > lastY && scroll > 200);
      // "over Hero" while scroll position is still within the Hero viewport
      setTransparent(scroll < window.innerHeight * 0.85);
      lastY = scroll;
    };
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  // body scroll lock while the mobile menu is open
  useEffect(() => {
    if (open) {
      lenis?.stop();
      document.documentElement.classList.add("overflow-hidden");
    } else {
      lenis?.start();
      document.documentElement.classList.remove("overflow-hidden");
    }
    return () => {
      lenis?.start();
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [open, lenis]);

  // Escape key closes the mobile menu
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const goTo = (e, href) => {
    e.preventDefault();
    setOpen(false);
    const el = document.querySelector(href);
    if (el && lenis) lenis.scrollTo(el, { offset: -40, duration: 1.4 });
  };

  return (
    <>
    <header
      ref={rootRef}
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 opacity-0 backdrop-blur-md transition-all duration-500 md:px-12 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        transparent
          ? "border-b border-white/10 bg-white/10 shadow-none"
          : "border-b border-ink/10 bg-ivory/85 shadow-[0_1px_24px_rgba(33,27,22,0.08)]"
      }`}
    >
      <a
        href="#top"
        onClick={(e) => goTo(e, "#top")}
        data-cursor="hover"
        className={`font-display text-lg italic tracking-wide transition-colors duration-500 ${
          transparent ? "text-ivory" : "text-ink"
        }`}
      >
        Maison Verre
      </a>

      <nav className="hidden items-center gap-10 md:flex">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => goTo(e, link.href)}
            data-cursor="hover"
            className={`group relative text-xs uppercase tracking-[0.25em] transition-colors duration-500 hover:text-gold ${
              transparent ? "text-ivory/80" : "text-ink/70"
            }`}
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
          </a>
        ))}
      </nav>

      <a
        ref={ctaRef}
        href="#footer"
        onClick={(e) => goTo(e, "#footer")}
        data-cursor="hover"
        className="hidden rounded-full border border-gold/60 px-6 py-2.5 text-xs uppercase tracking-[0.25em] text-gold transition-colors hover:bg-gold hover:text-ivory md:block"
      >
        Book Consultation
      </a>

      <button
        aria-label="Toggle menu"
        aria-expanded={open}
        data-cursor="hover"
        className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 md:hidden"
        onClick={() => setOpen((o) => !o)}
      >
        <span
          className={`h-px w-7 transition-all duration-300 ${transparent ? "bg-ivory" : "bg-ink"} ${
            open ? "translate-y-2 rotate-45" : ""
          }`}
        />
        <span
          className={`h-px w-7 transition-all duration-300 ${transparent ? "bg-ivory" : "bg-ink"} ${
            open ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`h-px w-7 transition-all duration-300 ${transparent ? "bg-ivory" : "bg-ink"} ${
            open ? "-translate-y-2 -rotate-45" : ""
          }`}
        />
      </button>
    </header>

      {/* rendered as a sibling, not a header descendant — a GSAP/Tailwind
          transform on the header would otherwise create a containing block
          that traps this fixed-position overlay inside the header's own box */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-ivory/98 backdrop-blur-md transition-opacity duration-500 md:hidden ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => goTo(e, link.href)}
            className="font-display text-3xl italic text-ink"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#footer"
          onClick={(e) => goTo(e, "#footer")}
          className="mt-4 rounded-full border border-gold/60 px-8 py-3 text-xs uppercase tracking-[0.25em] text-gold"
        >
          Book Consultation
        </a>
      </div>
    </>
  );
}
