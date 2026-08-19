import Hero from "@/components/Hero";
import About from "@/components/About";
import Services from "@/components/Services";
import DesignProcess from "@/components/DesignProcess";
import Gallery from "@/components/Gallery";
import BeforeAfter from "@/components/BeforeAfter";
import Testimonial from "@/components/Testimonial";
import Contact from "@/components/Contact";
import HeroAboutTransition from "@/components/transitions/HeroAboutTransition";
import AboutServicesTransition from "@/components/transitions/AboutServicesTransition";
import ServicesGalleryTransition from "@/components/transitions/ServicesGalleryTransition";
import ProcessTestimonialsTransition from "@/components/transitions/ProcessTestimonialsTransition";
import TestimonialsFooterTransition from "@/components/transitions/TestimonialsFooterTransition";

export const metadata = {
  title: "Samskriti Interiors | Luxury Interior Design Studio",
  description:
    "Luxury interior design studio creating timeless residential and commercial spaces.",
};

export default function Home() {
  return (
    <main>
      <Hero />
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
  );
}
