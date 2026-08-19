"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import DesignProcess from "@/components/DesignProcess";
import Gallery from "@/components/Gallery";
import BeforeAfter from "@/components/BeforeAfter";
import Testimonial from "@/components/Testimonial";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import HeroAboutTransition from "@/components/transitions/HeroAboutTransition";
import AboutServicesTransition from "@/components/transitions/AboutServicesTransition";
import ServicesGalleryTransition from "@/components/transitions/ServicesGalleryTransition";
import ProcessTestimonialsTransition from "@/components/transitions/ProcessTestimonialsTransition";
import TestimonialsFooterTransition from "@/components/transitions/TestimonialsFooterTransition";

export default function Home() {
  const [ready, setReady] = useState(false);

  return (
    <>
      {!ready && <LoadingScreen onComplete={() => setReady(true)} />}
      <Navbar ready={ready} />
      <main>
        <Hero ready={ready} />
        <HeroAboutTransition />
        <About />
        <AboutServicesTransition />
        <Services />
        <ServicesGalleryTransition />
        <Gallery />
        <BeforeAfter />
        <AboutServicesTransition />
        <DesignProcess />
        <ProcessTestimonialsTransition />
        <Testimonial />
        <TestimonialsFooterTransition />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
