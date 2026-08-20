"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import PageHero from "@/components/pages/PageHero";
import { SERVICES } from "@/data/services";

gsap.registerPlugin(ScrollTrigger);

function ServiceGridCard({ service, index }) {
  const { Icon } = service;

  return (
    <motion.div
      data-service-card
      data-cursor="hover"
      className="service-card group relative aspect-[4/5] overflow-hidden rounded-[1.75rem] border border-ink/10"
      initial="rest"
      whileHover="hover"
    >
      <motion.div
        className="absolute inset-0"
        variants={{ rest: { scale: 1 }, hover: { scale: 1.08 } }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(min-width: 1024px) 45vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover"
        />
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-t from-espresso via-espresso/45 to-espresso/10" />

      <span className="font-display pointer-events-none absolute right-6 top-4 select-none text-7xl font-normal leading-none text-transparent opacity-80 [-webkit-text-stroke:1px_rgba(245,240,232,0.25)]">
        {String(index + 1).padStart(2, "0")}
      </span>

      <Icon className="absolute left-6 top-6 h-8 w-8 text-gold drop-shadow-[0_1px_6px_rgba(33,27,22,0.6)]" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 md:p-8">
        <h3 className="font-display text-2xl font-normal text-ivory md:text-3xl">
          {service.title}
        </h3>
        <p className="max-w-sm text-sm leading-relaxed text-ivory/70">{service.description}</p>
        <span className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          Explore &rarr;
        </span>
      </div>
    </motion.div>
  );
}

export default function ServicesPage() {
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray("[data-service-card]");
      gsap.fromTo(
        cards,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: { trigger: gridRef.current, start: "top 80%" },
        }
      );
    }, gridRef);

    return () => ctx.revert();
  }, []);

  return (
    <main>
      <PageHero
        image="/images/services/modular-kitchen.webp"
        imageAlt="Modular luxury kitchen interior"
        eyebrow="Services"
        heading={<>Spaces designed around your <span className="italic text-gold">lifestyle</span>.</>}
      />

      <section className="relative w-full bg-ivory px-6 py-28 md:px-16">
        <div className="mb-14">
          <span className="text-xs uppercase tracking-[0.35em] text-gold">What We Do</span>
          <h2 className="font-display mt-4 max-w-xl text-4xl font-normal text-ink md:text-5xl">
            Every discipline, mastered.
          </h2>
        </div>

        <div ref={gridRef} className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:gap-10">
          {SERVICES.map((service, i) => (
            <ServiceGridCard key={service.title} service={service} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
