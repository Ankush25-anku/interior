"use client";

import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 500);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

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
    <div
      className="
      fixed
      right-8
      bottom-8
      max-sm:right-4
      max-sm:bottom-4
      z-[999]
      flex
      flex-col
      items-center
      gap-4
      "
    >
      {/* WhatsApp Button */}

      <motion.button
        aria-label="Chat on WhatsApp"
        onClick={openWhatsapp}
        initial={{
          scale: 0,
          opacity: 0,
        }}
        animate={{
          scale: 1,
          opacity: 1,
        }}
        whileHover={{
          scale: 1.12,
        }}
        whileTap={{
          scale: 0.92,
        }}
        className="
        group
        relative
        w-16
        h-16
        max-sm:w-14
        max-sm:h-14
        rounded-full
        flex
        items-center
        justify-center
        bg-[#25D366]
        text-white
        border
        border-white/40
        shadow-[0_20px_50px_rgba(37,211,102,0.35)]
        overflow-visible
        "
      >
        {/* Luxury Glow */}

        <span
          className="
          absolute
          inset-0
          rounded-full
          bg-[#25D366]
          opacity-30
          animate-ping
          "
        />

        {/* Icon */}

        <FaWhatsapp
          size={34}
          className="
          relative
          z-10
          max-sm:w-7
          max-sm:h-7
          "
        />

        {/* Tooltip Desktop */}

        <span
          className="
          hidden
          md:block
          absolute
          right-20
          top-1/2
          -translate-y-1/2
          opacity-0
          group-hover:opacity-100
          transition-all
          duration-300
          bg-[#211B16]
          text-[#F5F0E8]
          px-5
          py-3
          rounded-full
          text-[10px]
          tracking-[0.3em]
          whitespace-nowrap
          shadow-xl
          "
        >
          CHAT WITH US
        </span>
      </motion.button>

      {/* Back To Top */}

      <AnimatePresence>
        {showTop && (
          <motion.button
            aria-label="Scroll to top"
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.8,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.8,
            }}
            whileHover={{
              scale: 1.12,
            }}
            whileTap={{
              scale: 0.92,
            }}
            onClick={scrollToTop}
            className="
          w-14
          h-14
          max-sm:w-12
          max-sm:h-12
          rounded-full
          flex
          items-center
          justify-center
          bg-[#F5F0E8]
          text-[#211B16]
          border
          border-[#C9A45C]
          shadow-[0_15px_40px_rgba(201,164,92,0.35)]
          "
          >
            <ArrowUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
