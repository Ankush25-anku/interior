"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const STATS = [
  { value: "14+", label: "Years of Craft" },
  { value: "260", label: "Spaces Designed" },
  { value: "98%", label: "Client Satisfaction" },
];

export default function About() {
  const sectionRef = useRef(null);
  const linesRef = useRef(null);
  const paraRef = useRef(null);
  const imageWrapRef = useRef(null);
  const imageInnerRef = useRef(null);
  const imageRef = useRef(null);
  const statsRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const lines = linesRef.current.querySelectorAll(".about-line-inner");

      gsap.fromTo(
        lines,
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.1,
          ease: "power4.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );

      gsap.fromTo(
        paraRef.current,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 60%" },
        }
      );

      gsap.fromTo(
        statsRef.current.children,
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
        }
      );

      gsap.fromTo(
        imageWrapRef.current,
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.4,
          ease: "power4.inOut",
          scrollTrigger: { trigger: sectionRef.current, start: "top 65%" },
        }
      );

      gsap.to(imageInnerRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // exit: typography expands as the section hands off to Services
      gsap.to(statsRef.current.children, {
        scale: 1.18,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 95%",
          end: "bottom 15%",
          scrub: true,
        },
      });

      // exit: image panel morphs (scale + straighten corners) leaving About
      gsap.to(imageWrapRef.current, {
        scale: 1.06,
        borderRadius: "0.75rem",
        rotate: -1.5,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "bottom 95%",
          end: "bottom 15%",
          scrub: true,
        },
      });

      // continuous smooth "Ken Burns" scale on the photograph itself — isolated
      // to its own element/property so it never fights the wrap's exit scale.
      // Paused while the section is off-screen so it isn't ticking forever.
      gsap.to(imageRef.current, {
        scale: 1.1,
        duration: 22,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "play pause resume pause",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const panel = imageWrapRef.current;
    if (!panel || window.matchMedia("(pointer: coarse)").matches) return;

    const moveX = gsap.quickTo(imageRef.current, "x", { duration: 0.8, ease: "power3" });
    const moveY = gsap.quickTo(imageRef.current, "y", { duration: 0.8, ease: "power3" });

    const onMove = (e) => {
      const rect = panel.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      moveX(relX * 20);
      moveY(relY * 14);
    };
    const onLeave = () => {
      moveX(0);
      moveY(0);
    };

    panel.addEventListener("mousemove", onMove);
    panel.addEventListener("mouseleave", onLeave);
    return () => {
      panel.removeEventListener("mousemove", onMove);
      panel.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col items-center justify-center gap-16 overflow-hidden bg-ivory px-6 py-20 text-ink sm:px-10 md:flex-row md:gap-10 lg:px-20"
    >
      {/* subtle grain — keeps the flat ivory background from feeling sterile */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          mixBlendMode: "overlay",
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 flex w-full flex-col md:w-1/2">
        <span className="mb-8 text-xs uppercase tracking-[0.35em] text-gold">
          About Samskriti Interiors
        </span>

        <div
          ref={linesRef}
          className="font-about-display flex flex-col text-[clamp(2.5rem,10vw,4rem)] font-normal leading-[0.95] tracking-[-0.03em] md:text-[clamp(3rem,5vw,6rem)]"
        >
          <div className="overflow-hidden">
            <div className="about-line-inner">Every space tells a</div>
          </div>
          <div className="overflow-hidden">
            <div className="about-line-inner">
              story <span className="italic text-gold">crafted</span>, not
            </div>
          </div>
          <div className="overflow-hidden">
            <div className="about-line-inner">simply decorated.</div>
          </div>
        </div>

        <p
          ref={paraRef}
          className="mt-10 max-w-[550px] text-base leading-relaxed text-[#6b6257]"
        >
          Samskriti Interiors was founded on a simple belief: a home should
          feel inevitable, not designed. We blend the discipline of
          architecture with the warmth of Indian materiality &mdash; stone,
          brass, teak, light &mdash; into interiors that age gracefully and
          belong entirely to the people who live in them. Our vision is to
          redefine luxury as something quiet: considered proportion over
          ornament, texture over trend, permanence over fashion.
        </p>

        <div ref={statsRef} className="mt-14 grid grid-cols-3 gap-6 border-t border-ink/10 pt-8">
          {STATS.map((stat) => (
            <div key={stat.label}>
              <div className="font-display text-3xl text-gold">{stat.value}</div>
              <div className="mt-1 text-[0.65rem] uppercase tracking-[0.2em] text-ink/50">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full md:w-1/2">
        <div
          ref={imageWrapRef}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-[2rem] md:aspect-[4/5]"
        >
          <div ref={imageInnerRef} className="absolute inset-[-8%]">
            <Image
              ref={imageRef}
              src="/images/about/studio.webp"
              alt="Samskriti Interiors studio interior detail"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          {/* cinematic warm overlay — adds depth without hiding the photograph */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(155deg, rgba(33,27,22,0.28) 0%, transparent 45%, rgba(33,27,22,0.22) 100%)",
            }}
          />
        </div>
        <div className="pointer-events-none absolute -bottom-6 -left-6 hidden h-32 w-32 rounded-full border border-gold/40 md:block" />
      </div>
    </section>
  );
}
