"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaInstagram, FaPinterestP, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import useMagnetic from "@/hooks/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

const NAV_LINKS = ["About", "Services", "Gallery", "Testimonials"];
const SERVICE_LINKS = ["Modular Kitchen", "Bathroom Interiors", "Home Renovation", "Designer Lights"];
const SOCIALS = [
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaPinterestP, label: "Pinterest" },
  { Icon: FaLinkedinIn, label: "LinkedIn" },
  { Icon: FaXTwitter, label: "X" },
];

export default function Footer() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const wordmarkRef = useRef(null);
  const ctaRef = useMagnetic(0.25);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current.querySelectorAll(".reveal-line > span"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      gsap.fromTo(
        wordmarkRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: { trigger: wordmarkRef.current, start: "top 90%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      id="footer"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-espresso px-6 pt-28 text-ivory md:px-16"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 0%, rgba(201,164,92,0.1), transparent 55%)",
      }}
    >
      <div className="flex flex-col gap-16 border-b border-ivory/10 pb-16 md:flex-row md:items-end md:justify-between">
        <div ref={headingRef} className="max-w-xl">
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Get in Touch</span>
          <h2 className="font-display mt-5 text-4xl font-normal leading-[1.1] sm:text-5xl md:text-6xl">
            <div className="reveal-line overflow-hidden">
              <span className="block">Let&apos;s design your</span>
            </div>
            <div className="reveal-line overflow-hidden">
              <span className="block italic text-gold">next chapter</span>
            </div>
          </h2>
        </div>

        <a
          ref={ctaRef}
          href="mailto:studio@maisonverre.example"
          data-cursor="hover"
          className="inline-flex w-fit items-center gap-3 rounded-full bg-gold px-9 py-4 text-xs uppercase tracking-[0.25em] text-ink transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(201,164,92,0.4)]"
        >
          Book Consultation
        </a>
      </div>

      <div className="grid grid-cols-2 gap-10 py-16 md:grid-cols-4">
        <div>
          <span className="font-display text-lg italic text-ivory">Maison Verre</span>
          <p className="mt-4 max-w-[16rem] text-sm leading-relaxed text-ivory/55">
            A boutique interior architecture studio designing quiet luxury,
            room by room.
          </p>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-ivory/45">Navigate</h4>
          <ul className="mt-5 space-y-3">
            {NAV_LINKS.map((link) => (
              <li key={link}>
                <a
                  href={`#${link.toLowerCase()}`}
                  data-cursor="hover"
                  className="text-sm text-ivory/75 transition-colors hover:text-gold"
                >
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-ivory/45">Services</h4>
          <ul className="mt-5 space-y-3">
            {SERVICE_LINKS.map((link) => (
              <li key={link} className="text-sm text-ivory/75">
                {link}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-[0.25em] text-ivory/45">Contact</h4>
          <ul className="mt-5 space-y-3 break-words text-sm text-ivory/75">
            <li>studio@maisonverre.example</li>
            <li>+91 80 4567 1200</li>
            <li>Bengaluru, India</li>
          </ul>
          <div className="mt-6 flex gap-4">
            {SOCIALS.map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                data-cursor="hover"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-ivory/15 text-ivory/65 transition-colors hover:border-gold hover:text-gold"
              >
                <Icon size={13} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div
        ref={wordmarkRef}
        className="font-display select-none pb-6 pt-6 text-center text-[16vw] font-normal leading-none text-transparent opacity-0"
        style={{ WebkitTextStroke: "1px rgba(245,240,232,0.16)" }}
      >
        Maison Verre
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-ivory/10 py-6 text-xs text-ivory/45 md:flex-row">
        <span>&copy; {new Date().getFullYear()} Maison Verre Interior Studio.</span>
        <span>Crafted with quiet obsession.</span>
      </div>
    </footer>
  );
}
