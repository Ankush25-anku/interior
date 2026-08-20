"use client";

import { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SERVICES } from "@/data/services";

gsap.registerPlugin(ScrollTrigger);

function ServiceCard({ service, index }) {
  const cardRef = useRef(null);
  const { Icon } = service;

  const onMove = (e) => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateY: px * 12,
      rotateX: -py * 12,
      duration: 0.5,
      ease: "power2.out",
      transformPerspective: 800,
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
      className="service-card group relative h-[70vh] w-[85vw] shrink-0 overflow-hidden rounded-3xl border border-ivory/10 transition-colors duration-500 hover:border-gold/40 md:h-[450px] md:w-[300px] lg:h-[520px] lg:w-[360px]"
      style={{ transformStyle: "preserve-3d" }}
    >
      <Image
        src={service.image}
        alt={service.title}
        fill
        sizes="(min-width: 1024px) 360px, (min-width: 768px) 300px, 85vw"
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        priority={index < 2}
      />

      {/* glass overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/55 to-espresso/15" />
      <div className="absolute inset-0 bg-espresso/5 backdrop-blur-[1px]" />

      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-7 lg:p-8">
        <div className="flex items-start justify-between">
          <Icon className="h-8 w-8 text-gold drop-shadow-[0_1px_6px_rgba(33,27,22,0.6)] transition-transform duration-500 group-hover:scale-110 lg:h-9 lg:w-9" />
          <span className="font-display text-sm italic text-gold/70">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div>
          <span className="text-[0.65rem] uppercase tracking-[0.3em] text-gold/80">
            {service.category}
          </span>
          <h3 className="font-display mt-2 text-xl font-normal text-ivory drop-shadow-[0_1px_6px_rgba(33,27,22,0.6)] lg:text-2xl">
            {service.title}
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-ivory/80">{service.description}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-gold">
            Explore &rarr;
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const sectionRef = useRef(null);
  const wrapRef = useRef(null);
  const trackRef = useRef(null);
  const headingRef = useRef(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // heading reveal is transform-only — never opacity. Fully visible from
      // first paint; this only nudges it up once it's in view. If
      // ScrollTrigger never fires, it just stays at its default position.
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 75%",
        once: true,
        onEnter: () => {
          gsap.from(headingRef.current, { y: 32, duration: 1, ease: "power3.out" });
        },
      });

      // ONE horizontal-track system, identical at every breakpoint. Card
      // size is a pure CSS/Tailwind concern (see ServiceCard); the distance
      // formula below self-adjusts to whatever the current card width is,
      // so no matchMedia branching is needed for the animation itself.
      //
      // No pin:true, no GSAP pin-spacer, no position:fixed anywhere — the
      // wrapper's `sticky` positioning is pure CSS and needs zero JS to
      // hold the track on screen. If this effect never runs at all, the
      // cards are simply static inside the sticky frame, fully visible,
      // just without the horizontal motion.
      const track = trackRef.current;
      const wrap = wrapRef.current;

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 64);

      const setWrapHeight = () => {
        wrap.style.height = `calc(100vh + ${getDistance()}px)`;
      };
      setWrapHeight();

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => "+=" + getDistance(),
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      // recalculates on any width change — a plain viewport resize, or a
      // breakpoint crossing that changes the CSS card size (which changes
      // track.scrollWidth). Either way this keeps distance/height correct
      // without polling or a scroll listener.
      const ro = new ResizeObserver(() => {
        setWrapHeight();
        ScrollTrigger.refresh();
      });
      ro.observe(track);
      window.addEventListener("resize", setWrapHeight);

      return () => {
        ro.disconnect();
        window.removeEventListener("resize", setWrapHeight);
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative w-full bg-espresso">
      {/* h-[280vh] is the no-JS fallback height; the effect above refines
          it to the exact scroll distance once mounted. */}
      <div ref={wrapRef} className="h-[280vh]">
        <div className="sticky top-0 flex h-screen flex-col justify-center gap-8 overflow-hidden px-6 py-0 md:gap-10 md:px-10 lg:px-16">
          <div ref={headingRef} className="shrink-0">
            <span className="text-xs uppercase tracking-[0.35em] text-gold">Services</span>
            <h2 className="font-display mt-4 max-w-xl text-4xl font-normal text-ivory md:text-5xl">
              Every element, considered.
            </h2>
          </div>

          <div ref={trackRef} className="flex gap-5 pr-[10vw] md:gap-6">
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.title} service={service} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
