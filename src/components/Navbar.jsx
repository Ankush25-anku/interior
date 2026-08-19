"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { motion, AnimatePresence } from "framer-motion";
import useMagnetic from "@/hooks/useMagnetic";
import { useLenis } from "@/components/SmoothScroll";

const LINKS = [
  { label: "Home", href: "#top" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Projects", href: "#projects" },
  { label: "Process", href: "#process" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
];

const linkVariants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)" },
};

function NavLink({ link, onNavigate }) {
  const ref = useMagnetic(0.22);
  return (
    <a
      ref={ref}
      href={link.href}
      onClick={(e) => onNavigate(e, link.href)}
      data-cursor="hover"
      className="group relative whitespace-nowrap py-2 text-[0.62rem] uppercase tracking-[0.1em] text-ivory [text-shadow:0_2px_12px_rgba(0,0,0,0.35)] transition-colors duration-500 hover:text-gold xl:text-[0.68rem] xl:tracking-[0.22em]"
    >
      {link.label}
      <span className="pointer-events-none absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100" />
    </a>
  );
}

export default function Navbar({ ready }) {
  const rootRef = useRef(null);
  const pillRef = useRef(null);
  const logoRef = useRef(null);
  const ctaRef = useMagnetic(0.3);
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [transparent, setTransparent] = useState(true);

  // cinematic entrance — the whole floating pill materializes in
  useEffect(() => {
    if (!ready) return;
    gsap.fromTo(
      rootRef.current,
      { y: -32, opacity: 0, filter: "blur(8px)" },
      { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power4.out" }
    );

    // gentle continuous float on the wordmark — subtle, architectural, never distracting
    const floatTween = gsap.to(logoRef.current, {
      y: -3,
      duration: 2.6,
      ease: "sine.inOut",
      repeat: -1,
      yoyo: true,
      delay: 1.2,
    });
    return () => floatTween.kill();
  }, [ready]);

  // show/hide on scroll direction — driven entirely through GSAP so it never
  // fights the entrance tween's own inline transform on the same element
  useEffect(() => {
    if (!ready) return;
    gsap.to(rootRef.current, {
      y: hidden ? "-130%" : "0%",
      duration: 0.6,
      ease: "power3.inOut",
    });
  }, [hidden, ready]);

  // subtle pointer-driven depth on the pill itself — desktop/fine-pointer only
  useEffect(() => {
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) return;
    const movePillX = gsap.quickTo(pillRef.current, "x", { duration: 1.1, ease: "power3" });
    const movePillY = gsap.quickTo(pillRef.current, "y", { duration: 1.1, ease: "power3" });
    const onMove = (e) => {
      const relX = e.clientX / window.innerWidth - 0.5;
      const relY = e.clientY / window.innerHeight - 0.5;
      movePillX(relX * 6);
      movePillY(relY * 4);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

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
      <header ref={rootRef} className="fixed inset-x-0 top-0 z-50 px-4 pt-4 opacity-0 md:px-5 md:pt-6 xl:px-8">
        <div
          ref={pillRef}
          className={`mx-auto grid max-w-6xl grid-cols-[auto_1fr_auto] items-center gap-4 rounded-full border backdrop-blur-[18px] transition-colors duration-500 will-change-transform px-5 py-3 md:px-7 md:py-3.5 lg:px-5 xl:px-7 ${
            transparent
              ? "border-[rgba(201,164,92,0.25)] bg-[rgba(33,27,22,0.35)] shadow-[0_8px_32px_rgba(0,0,0,0.18)]"
              : "border-[rgba(201,164,92,0.35)] bg-[rgba(33,27,22,0.78)] shadow-[0_10px_40px_rgba(33,27,22,0.4)]"
          }`}
        >
          {/* static brand mark — not a link, not clickable (per current spec);
              navigation will be wired to it in a later pass */}
          <div ref={logoRef} className="flex shrink-0 items-center select-none">
            <Image
              src="/images/logo/samskriti-logo-transparent.webp"
              alt="Samskriti Interiors"
              width={743}
              height={480}
              priority
              className="h-auto w-[110px] shrink-0 md:w-[130px] lg:w-[140px] xl:w-[155px]"
            />
          </div>

          <nav className="hidden items-center justify-center gap-4 lg:flex xl:gap-8">
            {LINKS.map((link) => (
              <NavLink key={link.href} link={link} onNavigate={goTo} />
            ))}
          </nav>

          <div className="flex shrink-0 items-center justify-end gap-4">
            <a
              ref={ctaRef}
              href="#contact"
              onClick={(e) => goTo(e, "#contact")}
              data-cursor="hover"
              className="hidden shrink-0 rounded-full border border-gold/60 px-4 py-2.5 text-[0.65rem] uppercase tracking-[0.12em] text-gold transition-all duration-300 hover:scale-105 hover:bg-gold hover:text-espresso hover:shadow-[0_0_30px_rgba(201,164,92,0.4)] active:scale-95 lg:block xl:px-6 xl:text-xs xl:tracking-[0.25em]"
            >
              Book Consultation
            </a>

            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              data-cursor="hover"
              className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
              onClick={() => setOpen((o) => !o)}
            >
              <span
                className={`h-px w-7 bg-ivory transition-all duration-300 ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`h-px w-7 bg-gold transition-all duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`h-px w-7 bg-ivory transition-all duration-300 ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* mobile / tablet full-screen menu — rendered as a header sibling, not a
          descendant: a transform on the header would otherwise create a
          containing block that traps this fixed-position overlay inside it */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-espresso">
              <Image
                src="/images/hero/hero-room.webp"
                alt=""
                fill
                sizes="100vw"
                className="object-cover opacity-20"
              />
              <div className="absolute inset-0 bg-espresso/85 backdrop-blur-sm" />
            </div>

            <motion.div
              variants={{ hidden: {}, show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
              initial="hidden"
              animate="show"
              className="relative z-10 flex h-full flex-col items-center justify-center gap-5 px-6 sm:gap-6"
            >
              {LINKS.map((link) => (
                <motion.a
                  key={link.href}
                  variants={linkVariants}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  href={link.href}
                  onClick={(e) => goTo(e, link.href)}
                  className="font-display text-4xl italic text-ivory sm:text-5xl"
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.a
                variants={linkVariants}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                href="#contact"
                onClick={(e) => goTo(e, "#contact")}
                className="mt-4 rounded-full border border-gold/60 px-8 py-3.5 text-xs uppercase tracking-[0.25em] text-gold"
              >
                Book Consultation
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
