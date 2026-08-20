"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Canvas } from "@react-three/fiber";
import * as THREE from "three";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import RoomScene from "@/components/hero/RoomScene";
import useMagnetic from "@/hooks/useMagnetic";
import { useReady } from "@/components/layout/AppShell";

gsap.registerPlugin(SplitText, ScrollTrigger);

export default function Hero() {
  const ready = useReady();
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const canvasWrapRef = useRef(null);
  const eyebrowRef = useRef(null);
  const headingRef = useRef(null);
  const ctaWrapRef = useRef(null);
  const scrollRef = useRef(null);
  const pointer = useRef({ x: 0, y: 0 });
  const sceneProgress = useRef({ value: 0 });
  const primaryCta = useMagnetic(0.35);
  const secondaryCta = useMagnetic(0.35);
  // coarse-pointer (touch) devices get a lower pixel-ratio ceiling to keep
  // the 3D scene light — purely a perf tweak, no visual/layout change. Starts
  // at the fine-pointer default so SSR/first paint never mismatches on hydrate.
  const [maxDpr, setMaxDpr] = useState(1.8);
  const [lowPower, setLowPower] = useState(false);
  // the WebGL scene only needs to render while the Hero is anywhere near the
  // viewport — otherwise it's spending a full frame budget on pixels nobody
  // can see, every frame, for the rest of the session
  const [canvasVisible, setCanvasVisible] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setMaxDpr(1.2);
      setLowPower(true);
    }
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setCanvasVisible(entry.isIntersecting),
      { rootMargin: "50% 0px 50% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const moveImgX = gsap.quickTo(imageRef.current, "x", { duration: 0.9, ease: "power3" });
    const moveImgY = gsap.quickTo(imageRef.current, "y", { duration: 0.9, ease: "power3" });

    const onMove = (e) => {
      if (!canvasVisible) return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;

      // subtle parallax — the photo drifts opposite the cursor, behind the 3D layer
      moveImgX(pointer.current.x * -16);
      moveImgY(pointer.current.y * -10);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [canvasVisible]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // background photo: subtle cinematic zoom on scroll — opacity is never
      // touched here so the photograph always stays fully visible
      gsap.to(imageRef.current, {
        scale: 1.12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      // 3D scene fades/shrinks but never fully disappears, so it keeps
      // blending with the photograph as the section scrolls away
      gsap.to(canvasWrapRef.current, {
        scale: 0.88,
        opacity: 0.32,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(sceneProgress.current, {
        value: 1,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (!ready) return;

    const split = new SplitText(headingRef.current, { type: "words, lines" });
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.fromTo(
      imageRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 2.4, ease: "power3.out" },
      0
    );

    tl.fromTo(
      canvasWrapRef.current,
      { scale: 1.18, opacity: 0 },
      { scale: 1, opacity: 1, duration: 2.4, ease: "power3.out" },
      0
    );

    tl.fromTo(
      eyebrowRef.current,
      { y: 16, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9 },
      0.15
    );

    tl.fromTo(
      split.words,
      { yPercent: 120, rotate: 3, opacity: 0 },
      {
        yPercent: 0,
        rotate: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.05,
        ease: "power3.out",
      },
      0.3
    );

    tl.fromTo(
      ctaWrapRef.current.children,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.12 },
      "-=0.5"
    );

    tl.fromTo(
      scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8 },
      "-=0.3"
    );

    return () => {
      tl.kill();
      split.revert();
    };
  }, [ready]);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex h-[100svh] w-full items-center justify-center overflow-hidden bg-espresso"
    >
      {/* layer 1 (back) — hero photograph, always fully visible */}
      <div className="absolute inset-0 z-[1] overflow-hidden">
        <Image
          ref={imageRef}
          src="/images/hero/hero-room.webp"
          alt="Warmly lit luxury living room interior"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[82%_center] opacity-0 md:object-center"
        />
      </div>

      {/* layer 2 — cinematic warm overlay: top wash, radial glow behind the
          text, bottom wash. Never full opacity — the room stays visible. */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(20,15,10,0.25), transparent 40%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 45%, rgba(20,15,10,0.45), transparent 65%)",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(20,15,10,0.6), transparent 45%)",
          }}
        />
      </div>

      {/* layer 3 — 3D room scene */}
      <div ref={canvasWrapRef} className="absolute inset-0 z-[3] opacity-0">
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          dpr={[1, maxDpr]}
          frameloop={canvasVisible ? "always" : "never"}
          camera={{ position: [0, 0.6, 5.2], fov: 38 }}
          gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <RoomScene pointer={pointer} sceneProgress={sceneProgress} lowPower={lowPower} />
          </Suspense>
        </Canvas>
      </div>

      {/* layer 4 (front) — text */}
      <div className="relative z-10 flex flex-col items-center px-6 pt-20 text-center [@media(max-height:700px)]:pt-12 md:pt-0">
        <span
          ref={eyebrowRef}
          className="mb-8 block text-xs uppercase tracking-[0.5em] text-gold"
        >
          Luxury Interior Design Studio
        </span>

        <h1
          ref={headingRef}
          className="font-hero-display max-w-2xl text-[clamp(1.75rem,7vw,2.5rem)] font-normal leading-[1.12] tracking-[-0.02em] text-[#f8f3ea] [text-shadow:0_15px_50px_rgba(0,0,0,0.35)] md:max-w-4xl md:text-[clamp(2.25rem,4vw,3.75rem)]"
        >
          Crafting timeless spaces where architecture meets{" "}
          <span className="italic text-gold">emotion</span>.
        </h1>

        <div
          ref={ctaWrapRef}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 [@media(max-height:700px)]:mt-6 sm:mt-12 sm:gap-5"
        >
          <a
            ref={primaryCta}
            href="#contact"
            data-cursor="hover"
            className="rounded-full bg-gold px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-espresso transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(201,164,92,0.5)] sm:px-9 sm:py-4"
          >
            Book Consultation
          </a>
          <a
            ref={secondaryCta}
            href="#projects"
            data-cursor="hover"
            className="rounded-full border border-[rgba(255,255,255,0.35)] bg-[rgba(255,255,255,0.08)] px-7 py-3.5 text-xs uppercase tracking-[0.25em] text-ivory backdrop-blur-md transition-colors duration-300 hover:border-gold hover:text-gold sm:px-9 sm:py-4"
          >
            Explore Projects
          </a>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="absolute bottom-8 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-3 opacity-0 [@media(max-height:720px)]:bottom-4 [@media(max-height:720px)]:gap-1.5 min-[360px]:flex sm:bottom-10"
      >
        <span className="text-[0.6rem] uppercase tracking-[0.35em] text-ivory/60">Scroll</span>
        <div className="h-14 w-px overflow-hidden bg-ivory/25 [@media(max-height:700px)]:h-8">
          <div className="h-full w-full animate-scroll-line bg-gold" />
        </div>
      </div>
    </section>
  );
}
