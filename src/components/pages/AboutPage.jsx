"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PiClockCountdown,
  PiGearSix,
  PiPaintBrushBroad,
  PiUserFocus,
  PiMedal,
  PiHammer,
  PiMagnifyingGlass,
  PiDiamond,
} from "react-icons/pi";
import PageHero from "@/components/pages/PageHero";

gsap.registerPlugin(ScrollTrigger);

const PHILOSOPHY = [
  {
    Icon: PiClockCountdown,
    title: "Timeless Design",
    desc: "We design for decades, not seasons — proportion and restraint over passing trends.",
  },
  {
    Icon: PiGearSix,
    title: "Functionality",
    desc: "Every beautiful surface earns its place by serving how you actually move through your home.",
  },
  {
    Icon: PiPaintBrushBroad,
    title: "Material Selection",
    desc: "Stone, brass, teak and linen — sourced and matched by hand for texture, tone and longevity.",
  },
  {
    Icon: PiUserFocus,
    title: "Personalisation",
    desc: "No two studios, families or rituals are alike, so no two Samskriti interiors are either.",
  },
];

const WHY_US = [
  { Icon: PiMedal, title: "Experience", desc: "Over a decade composing residential and commercial interiors across India." },
  { Icon: PiHammer, title: "Craftsmanship", desc: "In-house artisans and vetted master craftsmen, not outsourced execution." },
  { Icon: PiMagnifyingGlass, title: "Attention to Detail", desc: "From plinth height to hardware finish, nothing is left to chance." },
  { Icon: PiDiamond, title: "Premium Materials", desc: "Only materials that age gracefully make it into a Samskriti home." },
];

const GALLERY_IMAGES = [
  { src: "/images/about/studio.webp", alt: "Samskriti Interiors studio detail", aspect: "aspect-[4/5]" },
  { src: "/images/process/design.webp", alt: "Design studio process detail", aspect: "aspect-[4/3]" },
  { src: "/images/projects/villa.webp", alt: "Luxury villa interior", aspect: "aspect-[4/3]" },
  { src: "/images/projects/kitchen.webp", alt: "Modular luxury kitchen", aspect: "aspect-[4/5]" },
  { src: "/images/services/wardrobe.webp", alt: "Custom wardrobe joinery detail", aspect: "aspect-[4/3]" },
  { src: "/images/projects/bedroom.webp", alt: "Luxury bedroom interior", aspect: "aspect-[4/5]" },
];

export default function AboutPage() {
  const storyRef = useRef(null);
  const storyImageRef = useRef(null);
  const storyLinesRef = useRef(null);
  const philosophyRef = useRef(null);
  const whyUsRef = useRef(null);
  const galleryRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Our Story — text mask reveal + image clip reveal + parallax
      gsap.fromTo(
        storyLinesRef.current.querySelectorAll(".about-line-inner"),
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.08,
          scrollTrigger: { trigger: storyRef.current, start: "top 70%" },
        }
      );

      gsap.fromTo(
        storyImageRef.current,
        { clipPath: "inset(100% 0% 0% 0%)", scale: 1.1 },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          scale: 1,
          duration: 1.4,
          ease: "power4.inOut",
          scrollTrigger: { trigger: storyRef.current, start: "top 65%" },
        }
      );

      gsap.to(storyImageRef.current, {
        yPercent: -8,
        ease: "none",
        scrollTrigger: { trigger: storyRef.current, start: "top bottom", end: "bottom top", scrub: true },
      });

      // Design Philosophy — staggered reveal
      gsap.fromTo(
        gsap.utils.toArray(philosophyRef.current.children),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: philosophyRef.current, start: "top 80%" },
        }
      );

      // Why Choose Us — staggered card reveal
      gsap.fromTo(
        gsap.utils.toArray(whyUsRef.current.children),
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: whyUsRef.current, start: "top 80%" },
        }
      );

      // Studio Gallery — staggered image reveal
      gsap.fromTo(
        gsap.utils.toArray(galleryRef.current.children),
        { y: 50, opacity: 0, scale: 0.96 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: galleryRef.current, start: "top 85%" },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <main>
      <PageHero
        image="/images/about/studio.webp"
        imageAlt="Samskriti Interiors studio interior detail"
        eyebrow="About Samskriti Interiors"
        heading={<>Designing spaces that tell <span className="italic text-gold">your story</span>.</>}
      />

      {/* 1. Our Story */}
      <section
        ref={storyRef}
        className="relative flex w-full flex-col items-center gap-16 overflow-hidden bg-ivory px-6 py-28 sm:px-10 md:flex-row md:gap-14 md:px-16"
      >
        <div className="relative z-10 w-full md:w-1/2">
          <span className="mb-8 block text-xs uppercase tracking-[0.35em] text-gold">Our Story</span>
          <div
            ref={storyLinesRef}
            className="font-about-display flex flex-col text-[clamp(2.25rem,7vw,3.5rem)] font-normal leading-[1.05] tracking-[-0.02em] text-ink"
          >
            <div className="overflow-hidden"><div className="about-line-inner">A studio built on</div></div>
            <div className="overflow-hidden"><div className="about-line-inner"><span className="italic text-gold">quiet</span> obsession.</div></div>
          </div>
          <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-[#6b6257]">
            <p>
              Samskriti Interiors began with a simple frustration: too many
              &ldquo;luxury&rdquo; interiors looked expensive without feeling considered.
              We started as a two-person studio in Bengaluru, drawing every joinery
              detail by hand, and that discipline never left us as we grew.
            </p>
            <p>
              Over a decade later, we&apos;ve carried that same obsession into villas,
              apartments, boutique offices and full-scale renovations across the
              city &mdash; always treating each project as a piece of architecture
              first, and decoration second.
            </p>
          </div>
        </div>

        <div className="relative z-10 w-full md:w-1/2">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem]">
            <div ref={storyImageRef} className="absolute inset-[-8%]">
              <Image
                src="/images/about/studio.webp"
                alt="Samskriti Interiors studio detail"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(155deg, rgba(33,27,22,0.28) 0%, transparent 45%, rgba(33,27,22,0.22) 100%)" }}
            />
          </div>
        </div>
      </section>

      {/* 2. Design Philosophy */}
      <section className="relative w-full bg-espresso px-6 py-28 text-ivory md:px-16">
        <div className="mb-14 max-w-xl">
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Design Philosophy</span>
          <h2 className="font-display mt-4 text-4xl font-normal md:text-5xl">
            Four principles, every project.
          </h2>
        </div>

        <div ref={philosophyRef} className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {PHILOSOPHY.map(({ Icon, title, desc }) => (
            <div key={title} className="border-t border-ivory/10 pt-6">
              <Icon className="h-8 w-8 text-gold" />
              <h3 className="font-display mt-5 text-xl font-normal text-ivory">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-ivory/65">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Why Choose Us */}
      <section className="relative w-full bg-ivory px-6 py-28 md:px-16">
        <div className="mb-14 max-w-xl">
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Why Choose Us</span>
          <h2 className="font-display mt-4 text-4xl font-normal text-ink md:text-5xl">
            What sets Samskriti apart.
          </h2>
        </div>

        <div ref={whyUsRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_US.map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="group rounded-[1.5rem] border border-ink/10 bg-white/40 p-8 transition-colors duration-500 hover:border-gold/50"
            >
              <Icon className="h-8 w-8 text-gold" />
              <h3 className="font-display mt-5 text-xl font-normal text-ink">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#6b6257]">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Studio Gallery */}
      <section className="relative w-full bg-espresso px-6 py-28 text-ivory md:px-16">
        <div className="mb-14 max-w-xl">
          <span className="text-xs uppercase tracking-[0.35em] text-gold">Studio Gallery</span>
          <h2 className="font-display mt-4 text-4xl font-normal md:text-5xl">
            A glimpse inside the studio.
          </h2>
        </div>

        <div ref={galleryRef} className="columns-1 gap-6 sm:columns-2 lg:columns-3">
          {GALLERY_IMAGES.map((img) => (
            <div key={img.src} className={`relative mb-6 w-full overflow-hidden rounded-2xl ${img.aspect}`}>
              <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
