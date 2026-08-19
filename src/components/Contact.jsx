"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { FaInstagram, FaPinterestP, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import useMagnetic from "@/hooks/useMagnetic";

gsap.registerPlugin(ScrollTrigger);

const SOCIALS = [
  { Icon: FaInstagram, label: "Instagram" },
  { Icon: FaPinterestP, label: "Pinterest" },
  { Icon: FaLinkedinIn, label: "LinkedIn" },
  { Icon: FaXTwitter, label: "X" },
];

const PROJECT_TYPES = [
  "Residential Interiors",
  "Luxury Villa Design",
  "Modular Kitchen Design",
  "Bedroom Design",
  "Commercial Interiors",
  "Office Spaces",
  "Renovation",
  "Custom Furniture",
];

export default function Contact() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const formRef = useRef(null);
  const panelRef = useRef(null);
  const whatsappRef = useMagnetic(0.25);
  const [submitted, setSubmitted] = useState(false);

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
        formRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: { trigger: formRef.current, start: "top 85%" },
        }
      );

      gsap.fromTo(
        panelRef.current,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: { trigger: panelRef.current, start: "top 85%" },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-espresso px-6 py-28 text-ivory md:px-16"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 80% 0%, rgba(201,164,92,0.12), transparent 55%)",
      }}
    >
      <div ref={headingRef} className="mx-auto max-w-6xl">
        <span className="text-xs uppercase tracking-[0.35em] text-gold">Get in Touch</span>
        <h2 className="font-display mt-5 text-4xl font-normal leading-[1.1] sm:text-5xl md:text-6xl">
          <div className="reveal-line overflow-hidden">
            <span className="block">Begin your</span>
          </div>
          <div className="reveal-line overflow-hidden">
            <span className="block italic text-gold">consultation</span>
          </div>
        </h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-6xl gap-12 md:grid-cols-2 md:gap-16">
        {/* consultation form */}
        <div ref={formRef} className="relative">
          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex h-full min-h-[22rem] flex-col items-center justify-center rounded-[1.5rem] border border-gold/30 bg-ivory/5 px-8 text-center"
              >
                <span className="font-display text-3xl italic text-gold">Thank you.</span>
                <p className="mt-4 max-w-xs text-sm leading-relaxed text-ivory/70">
                  We&apos;ve received your enquiry. A member of the Samskriti Interiors studio
                  will reach out within one business day.
                </p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                onSubmit={onSubmit}
                className="flex flex-col gap-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-ivory/50">
                    Full Name
                    <input
                      required
                      type="text"
                      name="name"
                      className="rounded-xl border border-ivory/15 bg-transparent px-4 py-3 text-sm normal-case tracking-normal text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
                      placeholder="Your name"
                    />
                  </label>
                  <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-ivory/50">
                    Phone
                    <input
                      required
                      type="tel"
                      name="phone"
                      className="rounded-xl border border-ivory/15 bg-transparent px-4 py-3 text-sm normal-case tracking-normal text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
                      placeholder="+91"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-ivory/50">
                  Email
                  <input
                    required
                    type="email"
                    name="email"
                    className="rounded-xl border border-ivory/15 bg-transparent px-4 py-3 text-sm normal-case tracking-normal text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
                    placeholder="you@email.com"
                  />
                </label>

                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-ivory/50">
                  Project Type
                  <select
                    name="projectType"
                    defaultValue=""
                    className="rounded-xl border border-ivory/15 bg-transparent px-4 py-3 text-sm normal-case tracking-normal text-ivory focus:border-gold focus:outline-none [&>option]:text-ink"
                  >
                    <option value="" disabled>
                      Select a project type
                    </option>
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.2em] text-ivory/50">
                  Tell us about your space
                  <textarea
                    name="message"
                    rows={4}
                    className="resize-none rounded-xl border border-ivory/15 bg-transparent px-4 py-3 text-sm normal-case tracking-normal text-ivory placeholder:text-ivory/30 focus:border-gold focus:outline-none"
                    placeholder="Location, size, timeline — anything that helps us understand your project."
                  />
                </label>

                <button
                  type="submit"
                  data-cursor="hover"
                  className="mt-2 w-fit rounded-full bg-gold px-9 py-4 text-xs uppercase tracking-[0.25em] text-espresso transition-shadow duration-300 hover:shadow-[0_0_40px_rgba(201,164,92,0.4)]"
                >
                  Request Consultation
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

        {/* contact info panel */}
        <div ref={panelRef} className="flex flex-col justify-between gap-10">
          <div className="flex flex-col gap-8">
            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] text-ivory/45">Studio</h4>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-ivory/75">
                4th Floor, Prestige Atrium
                <br />
                Residency Road, Bengaluru 560025
                <br />
                Karnataka, India
              </p>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] text-ivory/45">Email</h4>
              <a
                href="mailto:studio@samskritiinteriors.example"
                data-cursor="hover"
                className="mt-3 block text-sm text-ivory/75 transition-colors hover:text-gold"
              >
                studio@samskritiinteriors.example
              </a>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] text-ivory/45">Phone</h4>
              <a
                href="tel:+918045671200"
                data-cursor="hover"
                className="mt-3 block text-sm text-ivory/75 transition-colors hover:text-gold"
              >
                +91 80 4567 1200
              </a>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-[0.25em] text-ivory/45">Follow</h4>
              <div className="mt-4 flex gap-4">
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

          <a
            ref={whatsappRef}
            href="https://wa.me/919XXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="hover"
            className="flex w-fit items-center gap-3 rounded-full border border-gold/50 bg-ivory/5 px-7 py-4 text-xs uppercase tracking-[0.25em] text-gold transition-all duration-300 hover:bg-gold hover:text-espresso"
          >
            <FaWhatsapp size={18} />
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
