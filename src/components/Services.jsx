"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "@/data/services";

gsap.registerPlugin(ScrollTrigger);

function ServiceCard({ service }) {
  const cardRef = useRef(null);
  const { Icon } = service;

  const onMove = (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = cardRef.current;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateY: px * 14,
      rotateX: -py * 14,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 700,
    });
  };

  const onLeave = () => {
    gsap.to(cardRef.current, { rotateY: 0, rotateX: 0, duration: 0.6, ease: "power3.out" });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      data-cursor="hover"
      className="group relative h-[72vh] w-[90vw] shrink-0 overflow-hidden rounded-3xl border border-ivory/10 transition-colors duration-500 hover:border-gold/40 md:h-[420px] md:w-[280px] lg:w-[340px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <Image
        src={service.image}
        alt={service.title}
        fill
        sizes="(min-width: 1024px) 340px, (min-width: 768px) 280px, 90vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-espresso/15" />

      <div
        className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
      />

      <div className="relative z-10 flex h-full flex-col justify-end gap-4 p-6 md:justify-between md:gap-0 md:p-8">
        <Icon className="h-8 w-8 text-gold drop-shadow-[0_1px_6px_rgba(33,27,22,0.6)] transition-transform duration-500 group-hover:scale-110 md:h-10 md:w-10" />
        <div>
          <h3 className="font-display text-xl font-normal text-ivory drop-shadow-[0_1px_6px_rgba(33,27,22,0.6)] md:text-2xl">
            {service.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ivory/80">{service.desc}</p>
        </div>
        <span className="text-[0.65rem] uppercase tracking-[0.3em] text-gold">
          Explore &rarr;
        </span>
      </div>
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const headingRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );

      const mm = gsap.matchMedia();

      // desktop + tablet — untouched: pinned GSAP horizontal scroll, cards
      // ease back and soften as the track hands off into the Gallery
      mm.add("(min-width: 768px)", () => {
        const track = trackRef.current;
        const getScrollDistance = () => track.scrollWidth - window.innerWidth + 96;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => "+=" + getScrollDistance(),
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        tl.to(track, { x: () => -getScrollDistance(), ease: "none", duration: 0.85 }, 0)
          .to(track, { scale: 0.94, opacity: 0.7, ease: "power2.in", duration: 0.15 }, 0.85);

        return () => tl.scrollTrigger?.kill();
      });

      // mobile — same pin + horizontal-scrub mechanic as desktop, just
      // recalibrated: only one card fills the viewport, and the vertical
      // scroll input required to travel through all 18 cards is compressed
      // to a shorter, snappier pin distance than a 1:1 mapping would give
      mm.add("(max-width: 767px)", () => {
        const track = trackRef.current;
        const getTranslateDistance = () => track.scrollWidth - window.innerWidth;
        const getPinDistance = () => getTranslateDistance() * 0.55;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => "+=" + getPinDistance(),
            scrub: 1,
            pin: true,
            invalidateOnRefresh: true,
          },
        });

        tl.to(track, { x: () => -getTranslateDistance(), ease: "none" });

        return () => tl.scrollTrigger?.kill();
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-espresso"
    >
      <div className="flex h-full flex-col justify-center gap-6 py-10 md:gap-14 md:py-0">
        <div ref={headingRef} className="px-6 md:px-16">
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Services</span>
          <h2 className="font-display mt-4 max-w-xl text-4xl font-normal text-ivory md:text-5xl">
            Every element, considered.
          </h2>
        </div>

        <div
          ref={trackRef}
          className="flex gap-5 px-[5vw] md:gap-6 md:px-16 lg:gap-8"
        >
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
