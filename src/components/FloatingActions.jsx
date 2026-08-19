"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLenis } from "@/components/SmoothScroll";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    const onScroll = ({ scroll }) => setShowTop(scroll > 500);
    lenis.on("scroll", onScroll);
    return () => lenis.off("scroll", onScroll);
  }, [lenis]);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const openWhatsapp = () => {
    window.open("https://wa.me/919XXXXXXXXX", "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fixed right-8 bottom-8 z-[999] flex flex-col items-center gap-4 max-sm:right-4 max-sm:bottom-4">
      {/* WhatsApp Button */}

      <motion.button
        aria-label="Chat on WhatsApp"
        onClick={openWhatsapp}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.92 }}
        className="group relative flex h-16 w-16 items-center justify-center overflow-visible rounded-full border border-white/40 bg-[#25D366] text-white shadow-[0_20px_50px_rgba(37,211,102,0.35)] max-sm:h-14 max-sm:w-14"
      >
        {/* Luxury Glow */}

        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />

        {/* Icon */}

        <FaWhatsapp size={34} className="relative z-10 max-sm:h-7 max-sm:w-7" />

        {/* Tooltip Desktop */}

        <span className="absolute right-20 top-1/2 hidden -translate-y-1/2 whitespace-nowrap rounded-full bg-[#211B16] px-5 py-3 text-[10px] tracking-[0.3em] text-[#F5F0E8] opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100 md:block">
          CHAT WITH US
        </span>
      </motion.button>

      {/* Back To Top */}

      <AnimatePresence>
        {showTop && (
          <motion.button
            aria-label="Scroll to top"
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.8 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scale: 0.92 }}
            onClick={scrollToTop}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-[#C9A45C] bg-[#F5F0E8] text-[#211B16] shadow-[0_15px_40px_rgba(201,164,92,0.35)] max-sm:h-12 max-sm:w-12"
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
